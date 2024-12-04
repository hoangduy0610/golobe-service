
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Location } from './Location.entity';
import { Plan } from './Plan.entity';
import { PlanScheduleItem } from './PlanScheduleItem.entity';

@Entity()
export class PlanSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    day: number;

    @ManyToOne(() => Location)
    location: Location;

    @ManyToOne(() => Plan, plan => plan.schedule, { cascade:true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    plan: Plan;

    @OneToMany(() => PlanScheduleItem, item => item.schedule, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    items: PlanScheduleItem[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
