import {Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
      try {
        req['user'] = jwt.verify(token, process.env.JWT_SECRET) as any;
        return next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    return next();
  }
}
