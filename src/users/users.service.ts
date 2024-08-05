import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(user: CreateUserDto) {
    // hash password
    const hashedPassword = await argon.hash(user.password);
    user.password = hashedPassword;
    //create user
    try {
      const Createduser = await this.prisma.user.create({
        data: {
          ...user,
        },
      });
      delete Createduser.password;
      //return user
      return Createduser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        console.log(error);
        const msg = {
          title: 'this field is taken',
          field: error.meta.target[0],
        };
        throw new ForbiddenException(msg);
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await this.prisma.user.findMany({
        select: { password: false },
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        console.log(error);
        throw new ForbiddenException(error.meta);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      delete result.password;
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        console.log(error);
        throw new ForbiddenException(error.meta);
      }
      throw error;
    }
  }

  async getMe(id: number) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (foundUser) {
      delete foundUser.password;
      return foundUser;
    }
    throw new NotFoundException();
  }
}
