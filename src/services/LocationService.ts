import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { Location_CreateDto, Location_UpdateDto } from '@/dtos/Location_Dtos';
import { Location } from '@/entities/Location.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) { }

    async findAll(): Promise<Location[]> {
        return this.locationRepository.find({ withDeleted: false });
    }

    async findById(id: number): Promise<Location> {
        return this.locationRepository.findOne({
            where: { id },
            withDeleted: false,
        });
    }

    async create(dto: Location_CreateDto): Promise<Location> {
        return await this.locationRepository.save(dto);
    }

    async update(id: number, dto: Location_UpdateDto): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!location) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.LOCATION_NOT_FOUND);
        }

        return await this.locationRepository.save({
            ...location,
            ...dto,
        });
    }

    async delete(id: number): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!location) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.LOCATION_NOT_FOUND);
        }

        return await this.locationRepository.softRemove(location, { reload: true });
    }
}