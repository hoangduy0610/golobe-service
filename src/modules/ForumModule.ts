import { ForumFollow } from '@/entities/ForumFollow.entity';
import { ForumInteraction } from '@/entities/ForumInteraction.entity';
import { ForumPost } from '@/entities/ForumPost.entity';
import { User } from '@/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumController } from 'src/controllers/ForumController';
import { ForumService } from '../services/ForumService';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ForumPost,
            User,
            ForumInteraction,
            ForumFollow,
        ]),
    ],
    controllers: [ForumController],
    providers: [
        ForumService,
    ],
})
export class ForumModule { }