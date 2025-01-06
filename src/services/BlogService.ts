import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { Blog_CreateDto, Blog_UpdateDto } from '@/dtos/Blog_Dtos';
import { Blog } from '@/entities/Blog.entity';
import { Service } from '@/entities/Service.entity';
import { User } from '@/entities/User.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<Blog[]> {
        return this.blogRepository.find({ withDeleted: false });
    }

    async findById(id: number): Promise<Blog> {
        return this.blogRepository.findOne({
            where: { id },
            withDeleted: false,
        });
    }

    async create(userId: number, dto: Blog_CreateDto): Promise<Blog> {
        const services = await this.serviceRepository.find({
            where: { id: In(dto.linkedServiceIds) },
            withDeleted: false,
        });

        if (services.length !== dto.linkedServiceIds.length) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const entity = this.blogRepository.create({
            ...dto,
            linkedServices: services,
            user,
        });

        return await this.blogRepository.save(entity);
    }

    async update(id: number, dto: Blog_UpdateDto): Promise<Blog> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!blog) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.BLOG_NOT_FOUND);
        }

        if (dto.linkedServiceIds) {
            const services = await this.serviceRepository.find({
                where: { id: In(dto.linkedServiceIds) },
                withDeleted: false,
            });

            if (services.length !== dto.linkedServiceIds.length) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
            }

            blog.linkedServices = services;
        }

        return await this.blogRepository.save({
            ...blog,
            ...dto,
        });
    }

    async delete(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!blog) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.BLOG_NOT_FOUND);
        }

        return await this.blogRepository.softRemove(blog, { reload: true });
    }
}