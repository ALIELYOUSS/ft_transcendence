import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
  // Required when the account already has a password; omitted for Google-only accounts.
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
