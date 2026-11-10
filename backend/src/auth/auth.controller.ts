import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GoogleCallbackGuard } from './google/google-callback.guard';
import type { GoogleUser } from './google/google.strategy';
import { AdminGuard, type AuthenticatedRequest, JwtGuard, OwnerOrAdminGuard } from './Guards/guards';
import { REFRESH_COOKIE, clearRefreshCookie, setRefreshCookie } from './tokens';

const frontendUrl = () => process.env.FRONTEND_URL || 'https://localhost';

/*
 * Every route is reached from the browser as /api/auth/... (nginx strips /api).
 * How the pieces fit together is explained in ./README.md.
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // ======================= Sessions =======================

  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(email, password);
    setRefreshCookie(res, refreshToken);
    return { user, accessToken };
  }

  // Uses the refresh cookie to get a new access token (and rotates the cookie).
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookie: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (!cookie) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }
    const { accessToken, refreshToken } = await this.authService.refresh(cookie);
    setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookie: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (cookie) {
      await this.authService.logout(cookie);
    }
    clearRefreshCookie(res);
    return { message: 'Logged out successfully' };
  }

  // Step 1: redirect the browser to Google's sign-in page.
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  // Step 2: Google sends the browser back here. On success: set the refresh cookie and
  // go to /feed.
  // On failure: back to the login page with an error code it can show.
  @Get('google/callback')
  @UseGuards(GoogleCallbackGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const fail = (code: string) => res.redirect(`${frontendUrl()}/auth/login?error=${code}`);

    if (!req.user) {
      return fail('google_failed');
    }
    try {
      const { refreshToken } = await this.authService.loginWithGoogle(req.user as GoogleUser);
      setRefreshCookie(res, refreshToken);
      return res.redirect(`${frontendUrl()}/feed`);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return fail('google_email_unverified');
      }
      this.logger.error('Google sign-in failed', error instanceof Error ? error.stack : error);
      return fail('google_failed');
    }
  }

  // The logged-in user's own profile.
  @Get('me')
  @UseGuards(JwtGuard)
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.findOne(req.user!.sub);
  }

  // ======================= Users =======================
  // ('list' and 'me' are declared before ':id' so they aren't read as an id.)

  @Get('list')
  @UseGuards(JwtGuard, AdminGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAuthDto) {
    return this.authService.update(id, dto);
  }

  @Patch(':id/password')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
