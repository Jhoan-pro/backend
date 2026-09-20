import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { verifyPassword } from './password';

// Perform the same KDF work for unknown usernames to reduce enumeration timing differences.
const dummyHash = `scrypt$16384$8$1$${'0'.repeat(32)}$${'0'.repeat(128)}`;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findCredentialsByEmail(email);
    const valid = await verifyPassword(
      password,
      user ? user.password : dummyHash,
    );
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');
    const access_token = await this.jwt.signAsync({ sub: user.id });
    const payload = this.jwt.decode<{ exp: number; iat: number }>(access_token);
    return {
      access_token,
      token_type: 'Bearer' as const,
      expires_in: payload.exp - payload.iat,
    };
  }
}
