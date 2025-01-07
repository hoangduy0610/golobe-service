import { Location } from '@/entities/Location.entity';
import { Service } from '@/entities/Service.entity';
import { ServiceType } from '@/entities/ServiceType.entity';
import { Module } from '@nestjs/common';
import { ChatController } from 'src/controllers/ChatController';
import { ChatService } from '../services/ChatService';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Location,
            Service,
            ServiceType,
        ]),
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
    ],
})
export class ChatModule { }