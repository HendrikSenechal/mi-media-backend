import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import {
  MediaQuery,
  MediaResponseDto,
  UpdateMediaRequestDto,
  UploadMediaRequestDto,
} from './media.dto';
import { PaginatedResponseDto } from '../common/common.dto';

const MAX_FILES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = /^image\/(jpeg|png|webp|avif|gif)$/;

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all media, optionally filtered by category',
  })
  @Get()
  async getAll(
    @Query() query: MediaQuery,
  ): Promise<PaginatedResponseDto<MediaResponseDto>> {
    return this.mediaService.getAll(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Get media by ID',
    type: MediaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MediaResponseDto> {
    return this.mediaService.getById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        alt: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Upload one or more images',
    type: [MediaResponseDto],
  })
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: ALLOWED_TYPES }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() dto: UploadMediaRequestDto,
  ): Promise<MediaResponseDto[]> {
    return this.mediaService.upload(files, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update alt text or category',
    type: MediaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaRequestDto,
  ): Promise<MediaResponseDto> {
    return this.mediaService.update(id, dto);
  }

  @ApiResponse({ status: 204, description: 'Media deleted' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mediaService.remove(id);
  }
}
