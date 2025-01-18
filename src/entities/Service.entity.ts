
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ServiceType } from './ServiceType.entity';
import { EnumPriceRange } from '@/enums/EnumPriceRange';
import { EnumOpeningDay, EnumOpeningHours } from '@/enums/EnumOpening';
import { Review } from './Review.entity';
import { Blog } from './Blog.entity';
import { Location } from './Location.entity';

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

    @Column()
    locationId: number;

    @Column('jsonb')
    openingHours: OpeningHours[];

    @ManyToOne(() => ServiceType, serviceType => serviceType.services)
    serviceType: ServiceType;

    @ManyToOne(() => Location, location => location.services)
    location: Location;

    @OneToMany(() => Review, review => review.service)
    reviews: Review[];

    @OneToMany(() => Blog, blog => blog.linkedServices)
    linkedBlogs: Blog[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
