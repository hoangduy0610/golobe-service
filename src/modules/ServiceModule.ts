import { User } from '@/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from 'src/controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';
import { Service } from '@/entities/Service.entity';
import { ServiceType } from '@/entities/ServiceType.entity';
import { Location } from '@/entities/Location.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Service,
            ServiceType,
            Location,
        ]),
    ],
    controllers: [ServiceController],
    providers: [
        ServiceService,
    ],
})
export class ServiceModule { }