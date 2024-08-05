import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { userSchemaToSend } from 'src/users/dto/user.dto';
export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
