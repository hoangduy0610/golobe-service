
import { EnumRoles } from '@/enums/EnumRoles';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Review } from './Review.entity';
import { Blog } from './Blog.entity';
import { ForumPost } from './ForumPost.entity';
import { ForumInteraction } from './ForumInteraction.entity';
import { ForumFollow } from './ForumFollow.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column({ type: "enum", enum: Object.values(EnumRoles), default: EnumRoles.ROLE_USER })
    role: EnumRoles;

    @Column()
    name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Blog, blog => blog.user)
    blogs: Blog[];

    @OneToMany(() => ForumPost, forumPost => forumPost.user)
    forumPosts: ForumPost[];

    @OneToMany(() => ForumInteraction, forumInteraction => forumInteraction.user)
    forumInteractions: ForumInteraction[];

    @OneToMany(() => ForumFollow, forumFollow => forumFollow.follower)
    following: ForumFollow[];

    @OneToMany(() => ForumFollow, forumFollow => forumFollow.following)
    followers: ForumFollow[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
