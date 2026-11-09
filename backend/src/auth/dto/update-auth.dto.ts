import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

// Allowlist of fields a user may edit on their profile.
// `email` and `password` are deliberately absent: the global ValidationPipe
// (whitelist: true) strips them. Passwords change via PATCH /auth/:id/password.
export class UpdateAuthDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests?: string[];
}
