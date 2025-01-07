import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { Review_CreateDto, Review_UpdateDto } from '@/dtos/Review_Dtos';
import { Review } from '@/entities/Review.entity';
import { Service } from '@/entities/Service.entity';
import { User } from '@/entities/User.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    ) { }

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find({ 
            withDeleted: false,
            relations: ['user', 'service'],
         });
    }

    async findById(id: number): Promise<Review> {
        return this.reviewRepository.findOne({
            where: { id },
            withDeleted: false,
        });
    }

    async create(userId: number, dto: Review_CreateDto): Promise<Review> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const service = await this.serviceRepository.findOne({
            where: { id: dto.serviceId },
            withDeleted: false,
        });

        if (!service) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        const entity = await this.reviewRepository.create({
            rating: dto.rating,
            comment: dto.comment,
            user,
            service,
        });

        return await this.reviewRepository.save(entity);
    }

    async update(id: number, dto: Review_UpdateDto): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!review) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        return await this.reviewRepository.save({
            ...review,
            ...dto,
        });
    }

    async delete(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!review) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        return await this.reviewRepository.softRemove(review, { reload: true });
    }
}