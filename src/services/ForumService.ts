import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { ForumPost_CreateDto, ForumPost_UpdateDto } from '@/dtos/ForumPost_Dtos';
import { ForumFollow } from '@/entities/ForumFollow.entity';
import { ForumInteraction } from '@/entities/ForumInteraction.entity';
import { ForumPost } from '@/entities/ForumPost.entity';
import { User } from '@/entities/User.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ForumService {
    constructor(
        @InjectRepository(ForumPost) private readonly forumPostRepository: Repository<ForumPost>,
        @InjectRepository(ForumInteraction) private readonly forumInteractionRepository: Repository<ForumInteraction>,
        @InjectRepository(ForumFollow) private readonly forumFollowRepository: Repository<ForumFollow>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<ForumPost[]> {
        return this.forumPostRepository.find({
            withDeleted: false,
            relations: ['user', 'replies', 'reacts', 'reacts.user', 'replies.user', 'replies.reacts', 'replies.reacts.user'],
        });
    }

    async findMainTopics(): Promise<ForumPost[]> {
        return this.forumPostRepository.find({
            where: { 
                replyTo: IsNull(), 
                title: Not(IsNull()), 
            },
            withDeleted: false,
            relations: ['user', 'replies', 'reacts', 'reacts.user', 'replies.user', 'replies.reacts', 'replies.reacts.user'],
        });
    }

    async findById(id: number): Promise<ForumPost> {
        return this.forumPostRepository.findOne({
            where: { id },
            withDeleted: false,
            relations: ['user', 'replies', 'reacts', 'reacts.user', 'replies.user', 'replies.reacts', 'replies.reacts.user'],
        });
    }

    async create(userId: number, dto: ForumPost_CreateDto): Promise<ForumPost> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const entity = await this.forumPostRepository.create({
            content: dto.content,
            user,
        });

        if (dto.title) {
            entity.title = dto.title;
        }

        if (dto.replyToId) {
            const replyTo = await this.forumPostRepository.findOne({
                where: { id: dto.replyToId },
                withDeleted: false,
            });

            if (!replyTo) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
            }

            entity.replyTo = replyTo;
        }

        return await this.forumPostRepository.save(entity);
    }

    async update(id: number, dto: ForumPost_UpdateDto): Promise<ForumPost> {
        const forumPost = await this.forumPostRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!forumPost) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        if (dto.replyToId) {
            const replyTo = await this.forumPostRepository.findOne({
                where: { id: dto.replyToId },
                withDeleted: false,
            });

            if (!replyTo) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
            }

            forumPost.replyTo = replyTo;
        }

        return await this.forumPostRepository.save({
            ...forumPost,
            ...dto,
        });
    }

    async delete(id: number): Promise<ForumPost> {
        const forumPost = await this.forumPostRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!forumPost) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        return await this.forumPostRepository.softRemove(forumPost, { reload: true });
    }

    async react(userId: number, postId: number): Promise<ForumInteraction> {
        const post = await this.forumPostRepository.findOne({
            where: { id: postId },
            withDeleted: false,
        });

        if (!post) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const entity = this.forumInteractionRepository.create({
            post,
            user,
        });

        return await this.forumInteractionRepository.save(entity);
    }

    async unreact(userId: number, postId: number): Promise<ForumInteraction> {
        const entity = await this.forumInteractionRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
            withDeleted: false,
        });

        if (!entity) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        return await this.forumInteractionRepository.softRemove(entity, { reload: true });
    }

    async follow(followerId: number, followingId: number): Promise<ForumFollow> {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
            withDeleted: false,
        });

        if (!follower) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const following = await this.userRepository.findOne({
            where: { id: followingId },
            withDeleted: false,
        });

        if (!following) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const entity = this.forumFollowRepository.create({
            follower,
            following,
        });

        return await this.forumFollowRepository.save(entity);
    }

    async unfollow(followerId: number, followingId: number): Promise<ForumFollow> {
        const entity = await this.forumFollowRepository.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
            withDeleted: false,
        });

        if (!entity) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.FOLLOW_NOT_FOUND);
        }

        return await this.forumFollowRepository.softRemove(entity, { reload: true });
    }

    async getFollowers(userId: number): Promise<User[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const followers = await this.forumFollowRepository.find({
            where: { following: { id: userId } },
            relations: ['follower'],
        });

        return followers.map(f => f.follower);
    }

    async getFollowing(userId: number): Promise<User[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        const following = await this.forumFollowRepository.find({
            where: { follower: { id: userId } },
            relations: ['following'],
        });

        return following.map(f => f.following);
    }

    async getReacts(postId: number): Promise<User[]> {
        const post = await this.forumPostRepository.findOne({
            where: { id: postId },
            withDeleted: false,
        });

        if (!post) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.REVIEW_NOT_FOUND);
        }

        const reacts = await this.forumInteractionRepository.find({
            where: { post: { id: postId } },
            relations: ['user'],
        });

        return reacts.map(r => r.user);
    }
}