import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Constant } from 'src/commons/Constant';
import { AuthController } from 'src/controllers/AuthController';
import { JwtStrategy } from 'src/guards/JWTStrategy';
import { AuthService } from '../services/AuthService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ]),
        JwtModule.register({
            secret: Constant.JWT_SECRET,
            signOptions: { expiresIn: Constant.JWT_EXPIRE },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule { }