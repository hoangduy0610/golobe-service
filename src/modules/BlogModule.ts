import { Blog } from '@/entities/Blog.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from 'src/controllers/BlogController';
import { BlogService } from '../services/BlogService';
import { User } from '@/entities/User.entity';
import { Service } from '@/entities/Service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Blog,
            User,
            Service,
        ]),
    ],
    controllers: [BlogController],
    providers: [
        BlogService,
    ],
})
export class BlogModule { }