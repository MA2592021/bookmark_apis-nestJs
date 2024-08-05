import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import {
  CreateBookmarkDto,
  QueryDto,
  UpdateBookmarkDto,
} from './dto/bookmark.dto';
import { JWTGuard } from '../auth/gaurd';
import { GetUser } from '../auth/decorators';
import { PrismaClientExceptionFilter } from '../prisma/filters/prisma-client-exception.filter';

@UseGuards(JWTGuard)
@UseFilters(PrismaClientExceptionFilter)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @GetUser('id') id: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.create(id, createBookmarkDto);
  }
  @Post(':id')
  createForOtherUser(
    @Param('id') id: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.create(id, createBookmarkDto);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.bookmarksService.findAll(query);
  }

  @Get('user/:id')
  findAllForUser(@Param('id') id: string) {
    return this.bookmarksService.findAllForUser(+id);
  }

  @Get('user')
  findAllForCurrentUser(@GetUser('id') id: string) {
    return this.bookmarksService.findAllForUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(+id, updateBookmarkDto);
  }

  @Delete('user/:id')
  removeAllForUser(@Param('id') id: string) {
    return this.bookmarksService.removeAllForUser(+id);
  }
  @Delete('user')
  removeAllForCurrentUser(@GetUser('id') id: string) {
    return this.bookmarksService.removeAllForUser(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(+id);
  }
}
