
import { EnumVisibility } from '@/enums/EnumVisibility';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Service } from './Service.entity';
import { Location } from './Location.entity';
import { PlanSchedule } from './PlanSchedule.entity';

@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column({ type: "enum", enum: Object.values(EnumVisibility), default: EnumVisibility.PRIVATE })
    visibility: EnumVisibility;

    @Column({ nullable: true })
    startDate?: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @OneToMany(() => PlanSchedule, schedule => schedule.plan)
    schedule: PlanSchedule[];

    @ManyToMany(() => Service)
    savedServices: Service[];

    @ManyToOne(() => User)
    owner: User;

    @ManyToOne(() => Location)
    location: Location;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
