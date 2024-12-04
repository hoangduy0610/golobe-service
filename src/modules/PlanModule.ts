import { Plan } from '@/entities/Plan.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from 'src/controllers/PlanController';
import { PlanService } from '../services/PlanService';
import { User } from '@/entities/User.entity';
import { Location } from '@/entities/Location.entity';
import { Service } from '@/entities/Service.entity';
import { PlanSchedule } from '@/entities/PlanSchedule.entity';
import { PlanScheduleItem } from '@/entities/PlanScheduleItem.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Plan,
            User,
            Location,
            Service,
            PlanSchedule,
            PlanScheduleItem,
        ]),
    ],
    controllers: [PlanController],
    providers: [
        PlanService,
    ],
})
export class PlanModule { }