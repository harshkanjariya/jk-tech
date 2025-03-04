import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async verifyFirebaseToken(idToken: string) {
    try {
      // Verify Firebase Token
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);

      // Check if user exists
      let user = await this.usersRepository.findOne({ where: { providerId: decodedToken.uid } });

      if (!user) {
        // ✅ Create new user if not found
        user = this.usersRepository.create({
          providerId: decodedToken.uid,
          name: decodedToken.name || 'Unknown User',
          email: decodedToken.email || '',
          provider: 'firebase',
        });

        await this.usersRepository.save(user);
      }

      // Generate JWT Token
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: decodedToken.picture || '',
      };

      const jwt = this.jwtService.sign(payload, {
        expiresIn: '30d',
      });

      return { token: jwt, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
