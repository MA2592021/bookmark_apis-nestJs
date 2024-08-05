import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
