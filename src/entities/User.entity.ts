
import { EnumRoles } from '@/enums/EnumRoles';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column({ enum: Object.keys(EnumRoles) })
    role: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
