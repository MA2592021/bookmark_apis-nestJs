import {
  Injectable,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { GetUser, IS_PUBLIC_KEY } from '../decorators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    let isBlocked = true;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const ValidToken = super.canActivate(context);

    if (ValidToken) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.decode(token);

      console.log(decoded);

      isBlocked = await this.cacheManager.get(`${decoded.id}`);
    }
    if (isBlocked) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
