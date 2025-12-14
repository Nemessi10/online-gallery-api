import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { RequestWithUser } from '../common/types/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwks = createRemoteJWKSet(
    new URL(`https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`),
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.slice(7);

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
