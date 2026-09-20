import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { isUUID } from 'class-validator';
import { UsersService } from '../users/users.service';
import { jwtOptions } from './auth.config';

interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions().secret as string,
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (
      !payload ||
      typeof payload.sub !== 'number' ||
      !isUUID(payload.sub) ||
      typeof payload.exp !== 'number'
    )
      throw new UnauthorizedException();
    try {
      return await this.users.findOne(payload.sub);
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException();
      throw error;
    }
  }
}
