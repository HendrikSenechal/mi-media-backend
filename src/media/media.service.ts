import { Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { media } from '../drizzle/schema';
import { StorageService } from '../storage/storage.service';
import { PaginatedResponseDto } from '../common/common.dto';
import {
  MediaQuery,
  MediaResponseDto,
  UpdateMediaRequestDto,
  UploadMediaRequestDto,
} from './media.dto';

const STORAGE_PREFIX = 'media';

type MediaRow = typeof media.$inferSelect;

@Injectable()
export class MediaService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    private readonly storage: StorageService,
  ) {}

  async getAll(
    query: MediaQuery,
  ): Promise<PaginatedResponseDto<MediaResponseDto>> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const offset = (page - 1) * limit;

    const where = query.category
      ? eq(media.category, query.category)
      : undefined;

    const rows = await this.db
      .select()
      .from(media)
      .where(where)
      .orderBy(desc(media.createdAt), desc(media.id))
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .where(where);

    const items = await Promise.all(rows.map((row) => this.toResponse(row)));
    const total = Number(totalResult[0]?.count ?? 0);

    return { items, total };
  }

  async getById(id: number): Promise<MediaResponseDto> {
    return this.toResponse(await this.findRow(id));
  }

  async upload(
    files: Express.Multer.File[],
    dto: UploadMediaRequestDto,
  ): Promise<MediaResponseDto[]> {
    const result: MediaResponseDto[] = [];

    for (const file of files) {
      const storageKey = await this.storage.upload(STORAGE_PREFIX, file);

      try {
        const [{ id }] = await this.db
          .insert(media)
          .values({
            storageKey,
            originalName: file.originalname,
            contentType: file.mimetype,
            sizeBytes: file.size,
            alt: dto.alt ?? null,
            category: dto.category ?? null,
          })
          .$returningId();

        result.push(await this.getById(id));
      } catch (error) {
        // Don't leave an orphaned object in the bucket when the insert fails
        await this.storage.delete(storageKey);
        throw error;
      }
    }

    return result;
  }

  async update(
    id: number,
    dto: UpdateMediaRequestDto,
  ): Promise<MediaResponseDto> {
    await this.findRow(id);

    if (dto.alt !== undefined || dto.category !== undefined) {
      await this.db
        .update(media)
        .set({ alt: dto.alt, category: dto.category })
        .where(eq(media.id, id));
    }

    return this.getById(id);
  }

  async remove(id: number): Promise<void> {
    const row = await this.findRow(id);

    // Database first: if the bucket delete fails we keep an orphaned file,
    // never a database row pointing to a missing image.
    await this.db.delete(media).where(eq(media.id, id));
    await this.storage.delete(row.storageKey);
  }

  private async findRow(id: number): Promise<MediaRow> {
    const [row] = await this.db.select().from(media).where(eq(media.id, id));

    if (!row) {
      throw new NotFoundException('No media with this id exists');
    }

    return row;
  }

  private async toResponse(row: MediaRow): Promise<MediaResponseDto> {
    return {
      id: row.id,
      url: await this.storage.getUrl(row.storageKey),
      originalName: row.originalName,
      contentType: row.contentType,
      sizeBytes: row.sizeBytes,
      alt: row.alt,
      category: row.category,
      createdAt: row.createdAt,
    };
  }
}
