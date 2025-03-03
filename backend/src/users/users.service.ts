import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(profile: any, provider: string): Promise<User> {
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value || null;
    const name = profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`;

    let user = await this.usersRepository.findOne({ where: { providerId, provider } });

    if (!user) {
      user = this.usersRepository.create({
        provider,
        providerId,
        email,
        name,
      });

      await this.usersRepository.save(user);
    }

    return user;
  }
}
