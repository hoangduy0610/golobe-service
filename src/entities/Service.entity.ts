
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ServiceType } from './ServiceType.entity';
import { EnumPriceRange } from '@/enums/EnumPriceRange';
import { EnumOpeningDay, EnumOpeningHours } from '@/enums/EnumOpening';

export class OpeningHours {
    day: EnumOpeningDay;
    hours: EnumOpeningHours;
    customHours?: {
        open: string;
        close: string;
    };
}

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { array: true })
    images: string[];

    @Column()
    description: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    website?: string;

    @Column({ nullable: true })
    mapMarker?: string;

    @Column('text', { array: true })
    features: string[];

    @Column({ type: 'enum', enum: Object.values(EnumPriceRange), default: EnumPriceRange.CHEAP })
    priceRange: EnumPriceRange;

    @Column({ nullable: true })
    price?: string;

    @Column()
    serviceTypeId: number;

    @Column('jsonb')
    openingHours: OpeningHours[];

    @ManyToOne(() => ServiceType, serviceType => serviceType.services)
    serviceType: ServiceType;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
