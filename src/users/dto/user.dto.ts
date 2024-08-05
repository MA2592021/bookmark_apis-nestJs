import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
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

export class user {
  id: number;
  name: string;
  age: number;
  email: string;
}

export const userSchemaToSend = {
  id: true,
  name: true,
  age: true,
  email: true,
  password: false,
};

export class UpdateUserDto extends PartialType(CreateUserDto) {}
