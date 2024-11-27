import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Auth_LoginDto {
    @ApiProperty({ type: String, required: true, example: "hoangduy06104@gmail.com" })
    @IsEmail({ allow_underscores: true, allow_utf8_local_part: true }, { message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    readonly email: string;

    @ApiProperty({ type: String, required: true })
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    readonly password: string;
}