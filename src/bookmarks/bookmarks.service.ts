import { Injectable, NotFoundException } from '@nestjs/common';
import {
  bookmarkSchemaToSend,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from './dto/bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookMark = this.prisma.bookmark.create({
      data: { userId, ...createBookmarkDto },
    });

    return bookMark;
  }

  async findAll() {
    const bookmarks = await this.prisma.bookmark.findMany({
      select: { ...bookmarkSchemaToSend },
    });
    return bookmarks;
  }

  async findAllForUser(id: number) {
    return await this.prisma.bookmark.findMany({ where: { userId: id } });
  }

  async findOne(id: number) {
    const bookmarks = await this.prisma.bookmark.findUnique({
      where: { id: id },
      select: {
        ...bookmarkSchemaToSend,
      },
    });
    if (bookmarks) return bookmarks;
    throw new NotFoundException();
  }

  async update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return await this.prisma.bookmark.update({
      where: { id: id },
      data: { ...updateBookmarkDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.bookmark.delete({ where: { id: id } });
  }

  async removeAllForUser(id: number) {
    return await this.prisma.bookmark.deleteMany({ where: { userId: id } });
  }
}
