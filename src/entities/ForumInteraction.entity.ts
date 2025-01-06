import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { ForumPost } from "./ForumPost.entity";

@Entity()
export class ForumInteraction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ForumPost, forumPost => forumPost.reacts, { onDelete: 'CASCADE', cascade: true })
    post: ForumPost;

    @ManyToOne(() => User, user => user.forumInteractions, { cascade: true, onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}