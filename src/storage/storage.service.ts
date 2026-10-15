import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { ServerConfig, StorageConfig } from '../config/configuration';

// Only talks to the bucket; knows nothing about the database.
@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly config: StorageConfig;

  constructor(configService: ConfigService<ServerConfig>) {
    this.config = configService.get<StorageConfig>('storage')!;
    this.client = new S3Client({
      region: 'auto',
      endpoint: this.config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  /** Uploads a file under the given prefix and returns its object key. */
  async upload(prefix: string, file: Express.Multer.File): Promise<string> {
    const key = `${prefix}/${randomUUID()}${extname(file.originalname).toLowerCase()}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Keys are unique, so the content behind a key never changes
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return key;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }),
    );
  }

  /** Public URL when the bucket has a public domain, otherwise a signed URL. */
  async getUrl(key: string): Promise<string> {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${key}`;
    }

    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.config.bucket, Key: key }),
      { expiresIn: this.config.signedUrlTtl },
    );
  }
}
