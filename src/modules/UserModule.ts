import { User } from '@/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/UserController';
import { UserService } from '../services/UserService';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ])
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ],
})
export class UserModule { }