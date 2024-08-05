import { PartialType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { userSchemaToSend } from '../../users/dto/user.dto';
import { Type } from 'class-transformer';
export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  link: string;

  @IsOptional()
  @IsString()
  desc?: string;
}

export const bookmarkSchemaToSend = {
  //used before prisma omit
  user: { select: { ...userSchemaToSend } },
  id: true,
  title: true,
  desc: true,
  link: true,
  createdAt: true,
  updatedAt: true,
};

export class QueryDto {
  @IsOptional()
  @IsIn(['title', 'desc', 'link', 'createdAt', 'updatedAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @IsOptional()
  @IsIn(['title', 'desc', 'link', 'createdAt', 'updatedAt']) //didnt include user because user have a unique api
  filterBy?: string;

  @IsOptional()
  filter?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}
