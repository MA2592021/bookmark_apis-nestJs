import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 2,
    },
    { always: true },
  )
  password: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(18)
  @Max(80)
  age?: number;
}

export class signInUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export const userSchemaToSend = {
  //used before prisma omit
  id: true,
  name: true,
  age: true,
  email: true,
  password: false,
};
export class QueryDto {
  @IsOptional()
  @IsIn(['name', 'age', 'email', 'createdAt', 'updatedAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @IsOptional()
  @IsIn(['name', 'age', 'createdAt', 'updatedAt']) //didnt include email because email is unique
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

export class UpdateUserDto extends PartialType(CreateUserDto) {}
