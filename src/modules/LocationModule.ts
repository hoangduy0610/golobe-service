import { User } from '@/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from 'src/controllers/LocationController';
import { LocationService } from '../services/LocationService';
import { Location } from '@/entities/Location.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Location,
        ]),
    ],
    controllers: [LocationController],
    providers: [
        LocationService,
    ],
})
export class LocationModule { }