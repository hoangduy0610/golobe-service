
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PlanSchedule } from './PlanSchedule.entity';
import { Service } from './Service.entity';

@Entity()
export class PlanScheduleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlanSchedule)
    schedule: PlanSchedule;

    @ManyToOne(() => Service)
    service: Service;

    @Column({ nullable: true })
    startTime?: Date;

    @Column({ nullable: true })
    endTime?: Date;

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
