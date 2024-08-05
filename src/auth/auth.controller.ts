import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, signInUser } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() user: signInUser) {
    return this.authService.signIn(user);
  }
  @Post('/signup')
  signUp(@Body() user: CreateUserDto) {
    return this.authService.create(user);
  }
}
