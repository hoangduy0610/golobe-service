import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { ServiceType_CreateDto } from '@/dtos/ServiceType_CreateDto';
import { ServiceType_UpdateDto } from '@/dtos/ServiceType_UpdateDto';
import { ServiceType } from '@/entities/ServiceType.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceTypeService {
    constructor(
        @InjectRepository(ServiceType)
        private readonly serviceTypeRepository: Repository<ServiceType>,
    ) { }

    async findAll(): Promise<ServiceType[]> {
        return this.serviceTypeRepository.find({ withDeleted: false });
    }

    async findById(id: number): Promise<ServiceType> {
        return this.serviceTypeRepository.findOne({
            where: { id },
            withDeleted: false,
        });
    }

    async create(dto: ServiceType_CreateDto): Promise<ServiceType> {
        return await this.serviceTypeRepository.save(dto);
    }

    async update(id: number, dto: ServiceType_UpdateDto): Promise<ServiceType> {
        const serviceType = await this.serviceTypeRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!serviceType) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_TYPE_NOT_FOUND);
        }

        return await this.serviceTypeRepository.save({
            ...serviceType,
            ...dto,
        });
    }

    async delete(id: number): Promise<ServiceType> {
        const serviceType = await this.serviceTypeRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!serviceType) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_TYPE_NOT_FOUND);
        }

        return await this.serviceTypeRepository.softRemove(serviceType, { reload: true });
    }
}