import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, signInUser } from '../users/dto/user.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
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
      return this.issueToken(foundUser);
    }
    if (!foundUser) {
      msg.field = 'email';
    } else {
      msg.field = 'password';
    }

    throw new ForbiddenException(msg);
  }

  async issueToken({
    email,
    id,
    name,
  }: {
    email: string;
    id: number;
    name: string;
  }): Promise<{ access_token: string }> {
    const payload = { email, id, name };
    const secret = this.config.get('secret_key');
    const expiresIn = this.config.get('exp_date');
    const access_token = await this.jwt.signAsync(payload, {
      secret,
      expiresIn,
    });
    return { access_token };
  }
}
