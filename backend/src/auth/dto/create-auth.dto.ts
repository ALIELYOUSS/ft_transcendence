import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    // static schema = z.object({
    //     username: z.string().min(3).max(20),
    //     email: z.string().email(),
    //     password: z.string().min(6).max(100),
    // });

    // email: string
    // username: string
    // password: string
}
