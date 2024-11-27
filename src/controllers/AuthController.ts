import { Auth_RegiserDto } from '@/dtos/Auth_RegisterDto';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth_LoginDto } from 'src/dtos/Auth_LoginDto';
import { RoleGuard } from 'src/guards/RoleGuard';
import { AuthService } from 'src/services/AuthService';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signin')
    @ApiOperation({ summary: 'Đăng nhập', description: 'Api đăng nhập người dùng' })
    async auth(@Req() req, @Res() res, @Body() userAuthDto: Auth_LoginDto) {
        return res.status(HttpStatus.OK).json(await this.authService.login(userAuthDto));
    }

    @Post('/register')
    @ApiOperation({ summary: 'Đăng ký', description: 'Api đăng ký người dùng' })
    async register(@Req() req, @Res() res, @Body() dto: Auth_RegiserDto) {
        return res.status(HttpStatus.OK).json(await this.authService.register(dto));
    }

    @Get('/callback')
    @ApiOperation({ summary: 'Callback', description: 'Api callback' })
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async callback(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json({ msg: "ok", data: req.user });
    }
}