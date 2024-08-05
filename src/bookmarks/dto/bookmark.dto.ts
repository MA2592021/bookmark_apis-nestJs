import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { userSchemaToSend } from '../../users/dto/user.dto';
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
  user: { select: { ...userSchemaToSend } },
  id: true,
  title: true,
  desc: true,
  link: true,
  createdAt: true,
  updatedAt: true,
};

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}
