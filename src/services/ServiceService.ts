import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { Service_CreateDto, Service_UpdateDto } from '@/dtos/Service_Dtos';
import { Service } from '@/entities/Service.entity';
import { ServiceType } from '@/entities/ServiceType.entity';
import { EnumOpeningHours } from '@/enums/EnumOpening';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServiceType)
        private readonly serviceTypeRepository: Repository<ServiceType>,
    ) { }

    async findAll(): Promise<Service[]> {
        return this.serviceRepository.find({
            withDeleted: false,
            relations: ['serviceType', 'reviews'],
        });
    }

    async findById(id: number): Promise<Service> {
        return this.serviceRepository.findOne({
            where: { id },
            withDeleted: false,
            relations: ['serviceType', 'reviews', 'reviews.user'],
        });
    }

    async create(dto: Service_CreateDto): Promise<Service> {
        // Check if the service type exists
        const serviceType = await this.serviceTypeRepository.findOne({
            where: { id: dto.serviceTypeId },
            withDeleted: false,
        });

        if (!serviceType) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_TYPE_NOT_FOUND);
        }

        // Check Opening Hours
        if (!dto.openingHours || dto.openingHours.length === 0) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_REQUIRED);
        }

        // Remove duplicates
        for (const openingHour of dto.openingHours) {
            if (!openingHour.day || !openingHour.hours) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_WRONG_FORMAT);
            }

            if (openingHour.hours == EnumOpeningHours.CUSTOM) {
                if (!openingHour?.customHours?.open || !openingHour?.customHours?.close) {
                    throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_WRONG_FORMAT);
                }
            }
        }

        try {
            return await this.serviceRepository.save(dto);
        } catch (error) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_CREATE_FAILED);
        }
    }

    async update(id: number, dto: Service_UpdateDto): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!service) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        if (dto.serviceTypeId) {
            const serviceType = await this.serviceTypeRepository.findOne({
                where: { id: dto.serviceTypeId },
                withDeleted: false,
            });

            if (!serviceType) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_TYPE_NOT_FOUND);
            }
        }

        if (dto.openingHours) {
            // Check Opening Hours
            if (dto.openingHours.length === 0) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_REQUIRED);
            }

            // Remove duplicates
            for (const openingHour of dto.openingHours) {
                if (!openingHour.day || !openingHour.hours) {
                    throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_WRONG_FORMAT);
                }

                if (openingHour.hours == EnumOpeningHours.CUSTOM) {
                    if (!openingHour?.customHours?.open || !openingHour?.customHours?.close) {
                        throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.OPENING_HOURS_WRONG_FORMAT);
                    }
                }
            }
        }

        return await this.serviceRepository.save({
            ...service,
            ...dto,
        });
    }

    async delete(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!service) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        return await this.serviceRepository.softRemove(service, { reload: true });
    }
}