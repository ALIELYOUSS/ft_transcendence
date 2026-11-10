import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 * Like AuthGuard('google'), but never throws. If the state check or the exchange with Google
 * fails, req.user is left empty and the controller redirects to the login page with an error,
 * instead of the browser landing on a JSON error page.
 */
@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleCallbackGuard.name);

  handleRequest<TUser>(err: unknown, user: TUser, info: unknown): TUser {
    if (err || !user) {
      const reason = err instanceof Error ? err.message : JSON.stringify(info ?? err);
      this.logger.warn(`Google sign-in rejected: ${reason}`);
    }
    return user || (null as TUser);
  }
}
