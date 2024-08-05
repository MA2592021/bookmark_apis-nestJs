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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, signInUser, user } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { JWTGuard } from '../auth/gaurd';
import { GetUser, Public } from '../auth/decorators';
import { PrismaClientExceptionFilter } from 'src/prisma/filters/prisma-client-exception.filter';

@UseGuards(JWTGuard)
@UseFilters(PrismaClientExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/getMe')
  getMe(@GetUser('id') userId: number) {
    return this.usersService.getMe(userId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @Patch('')
  selfUpdate(@GetUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Delete()
  selfRemove(@GetUser('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
