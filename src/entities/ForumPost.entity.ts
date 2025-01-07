import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { ForumInteraction } from "./ForumInteraction.entity";

@Entity()
export class ForumPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => ForumPost, forumPost => forumPost.replies, { nullable: true, onDelete: 'CASCADE', cascade: true })
    replyTo: ForumPost;

    @OneToMany(() => ForumPost, forumPost => forumPost.replyTo)
    replies: ForumPost[];

    @ManyToOne(() => User, user => user.forumPosts, { cascade: true, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => ForumInteraction, forumInteraction => forumInteraction.post)
    reacts: ForumInteraction[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}