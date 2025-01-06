import { Review } from '@/entities/Review.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from 'src/controllers/ReviewController';
import { ReviewService } from '../services/ReviewService';
import { User } from '@/entities/User.entity';
import { Service } from '@/entities/Service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Review,
            User,
            Service,
        ]),
    ],
    controllers: [ReviewController],
    providers: [
        ReviewService,
    ],
})
export class ReviewModule { }