
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PlanSchedule } from './PlanSchedule.entity';
import { Service } from './Service.entity';

@Entity()
export class PlanScheduleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlanSchedule, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    schedule: PlanSchedule;

    @ManyToOne(() => Service)
    service: Service;

    @Column({ nullable: true })
    startTime?: string;

    @Column({ default: 1 })
    order: number;

    @Column({ nullable: true })
    endTime?: string;

    @Column({ nullable: true })
    reservationCode?: string;

    @Column({ nullable: true })
    note?: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
