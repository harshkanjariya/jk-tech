import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('firebase-login')
  async firebaseLogin(@Body() body: { idToken: string }) {
    return this.authService.verifyFirebaseToken(body.idToken);
  }
}
