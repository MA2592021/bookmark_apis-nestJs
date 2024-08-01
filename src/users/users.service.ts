import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto, signInUser } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async signIn(user: signInUser) {
    let psMatch = false;
    let msg = { title: 'Credintials error', field: '' };
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (foundUser) {
      psMatch = await argon.verify(foundUser.password, user.password);
    }
    if (psMatch) {
      delete foundUser.password;
      return foundUser;
    }
    if (!foundUser) {
      msg.field = 'email';
    } else {
      msg.field = 'password';
    }

    throw new ForbiddenException(msg);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
