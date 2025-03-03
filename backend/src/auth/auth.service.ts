import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async validateOAuthUser(profile: any, provider: string) {
    const user = await this.usersService.findOrCreate(profile, provider);
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}

