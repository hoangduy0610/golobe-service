import { User } from '@/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTypeController } from 'src/controllers/ServiceTypeController';
import { ServiceTypeService } from '../services/ServiceTypeService';
import { ServiceType } from '@/entities/ServiceType.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ServiceType,
        ]),
    ],
    controllers: [ServiceTypeController],
    providers: [
        ServiceTypeService,
    ],
})
export class ServiceTypeModule { }