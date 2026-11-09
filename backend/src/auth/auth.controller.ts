import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AdminGuard, JwtGuard, OwnerOrAdminGuard } from './Guards/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Post('logout')
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.logout(refreshToken);
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refresh(refreshToken);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() request: Request, @Res() response: Response) {
    const tokens = await this.authService.loginWithGoogle(
      request.user as {
        googleId: string;
        email?: string;
        username?: string;
      }
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';
    const callbackUrl = new URL(`${frontendUrl}/auth/google/callback`);
    callbackUrl.searchParams.set('accessToken', tokens.accessToken);
    callbackUrl.searchParams.set('refreshToken', tokens.refreshToken);

    return response.redirect(callbackUrl.toString());
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

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
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Patch(':id/password')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, OwnerOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
