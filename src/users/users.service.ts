import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, userSchemaToSend } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(user: CreateUserDto) {
    // hash password
    const hashedPassword = await argon.hash(user.password);
    user.password = hashedPassword;

    //create user
    const Createduser = await this.prisma.user.create({
      data: {
        ...user,
      },
    });
    delete Createduser.password;

    //return user
    return Createduser;
  }

  async findAll() {
    try {
      const result = await this.prisma.user.findMany({
        select: { ...userSchemaToSend },
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
    //find user
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
    //delete password
    delete updatedUser.password;
    //return user
    return updatedUser;
  }

  async remove(id: number) {
    const result = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    delete result.password;
    return result;
  }

  async getMe(id: number) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: id },
      select: { ...userSchemaToSend },
    });
    if (foundUser) {
      // delete foundUser.password;
      return foundUser;
    }
    throw new NotFoundException();
  }
}
