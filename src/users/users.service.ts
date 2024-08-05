import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, QueryDto, userSchemaToSend } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
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

  async findAll({
    sortBy,
    sortOrder,
    filter,
    filterBy,
    page,
    pageSize,
  }: QueryDto) {
    let where = {};
    let skip = 0;
    if (filterBy) {
      where = {
        [filterBy]: filter,
      };
    }
    if (page) {
      skip = (page - 1) * pageSize;
    }
    const result = await this.prisma.user.findMany({
      // select: { ...userSchemaToSend },
      omit: { password: true },
      orderBy: [{ [sortBy]: sortOrder }],
      where,
      skip,
      take: pageSize,
    });

    return result;
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //find user
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
      omit: { password: true },
    });
    //return user
    return updatedUser;
  }

  async remove(id: number) {
    const result = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    await this.cacheManager.set(`${result.id}`, result.id, 15 * 60 * 1000);
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
