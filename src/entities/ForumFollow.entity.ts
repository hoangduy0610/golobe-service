import { CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class ForumFollow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.followers, { cascade: true, onDelete: 'CASCADE' })
    following: User;

    @ManyToOne(() => User, user => user.following, { cascade: true, onDelete: 'CASCADE' })
    follower: User;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}