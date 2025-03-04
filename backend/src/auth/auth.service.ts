import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App,
    private jwtService: JwtService,
  ) {}

  async verifyFirebaseToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);

      const payload = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
      };

      const jwt = this.jwtService.sign(payload, {
        expiresIn: '30d',
      });

      return { token: jwt };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
