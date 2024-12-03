import { EnumServiceTypeFilters } from '@/enums/EnumServiceTypeFilters';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Service } from './Service.entity';

@Entity()
export class ServiceType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "enum", enum: Object.values(EnumServiceTypeFilters), array: true, default: [] })
    filters: EnumServiceTypeFilters[];

    @OneToMany(() => Service, service => service.serviceType)
    services: Service[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
