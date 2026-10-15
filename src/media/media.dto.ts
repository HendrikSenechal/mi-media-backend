import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQuery } from '../common/common.dto';

export class MediaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example:
      'https://images.mimedia.be/media/3f9c2b1e-7a4d-4c1b-9f0e-1a2b3c4d5e6f.webp',
    description: 'Public or signed URL to the image',
  })
  url: string;

  @ApiProperty({ example: 'hero-banner.webp' })
  originalName: string;

  @ApiProperty({ example: 'image/webp' })
  contentType: string;

  @ApiProperty({ example: 245760, description: 'File size in bytes' })
  sizeBytes: number;

  @ApiProperty({ example: 'Team at a photoshoot', nullable: true })
  alt: string | null;

  @ApiProperty({ example: 'portfolio', nullable: true })
  category: string | null;

  @ApiProperty({ example: '2026-10-15 14:32:10' })
  createdAt: string;
}

export class UploadMediaRequestDto {
  @ApiProperty({ required: false, example: 'Team at a photoshoot' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;

  @ApiProperty({ required: false, example: 'portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}

export class UpdateMediaRequestDto extends UploadMediaRequestDto {}

export class MediaQuery extends PaginationQuery {
  @ApiProperty({ required: false, example: 'portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
