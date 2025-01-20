import { Constant } from '@/commons/Constant';
import { MessageCode } from '@/commons/MessageCode';
import { ApplicationException } from '@/controllers/ExceptionController';
import { PlanSchedule_AddItemDto, PlanSchedule_RemoveItemDto, PlanSchedule_SetLocationDto, PlanScheduleItemOrderDto } from '@/dtos/PlanSchedule_Dtos';
import { Plan_CreateDto, Plan_RemoveSavedItemDto, Plan_SaveItemDto, Plan_UpdateDto } from '@/dtos/Plan_Dtos';
import { Location } from '@/entities/Location.entity';
import { Plan } from '@/entities/Plan.entity';
import { PlanSchedule } from '@/entities/PlanSchedule.entity';
import { PlanScheduleItem } from '@/entities/PlanScheduleItem.entity';
import { Service } from '@/entities/Service.entity';
import { User } from '@/entities/User.entity';
import { EnumVisibility } from '@/enums/EnumVisibility';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { EnumRoles } from '@/enums/EnumRoles';
import { createPdf } from '@leninlb/nestjs-html-to-pdf';
import * as path from 'path';
import * as moment from 'moment';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
        @InjectRepository(PlanSchedule)
        private readonly planScheduleRepository: Repository<PlanSchedule>,
        @InjectRepository(PlanScheduleItem)
        private readonly planScheduleItemRepository: Repository<PlanScheduleItem>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<Plan[]> {
        return this.planRepository.find({
            withDeleted: false,
            relations: ['owner', 'location', 'savedServices', 'schedule', 'schedule.location', 'schedule.items', 'schedule.items.service'],
        });
    }

    async findById(id: number, authorization?: string): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id },
            relations: ['owner', 'location', 'savedServices', 'schedule', 'schedule.location', 'schedule.items', 'schedule.items.service'],
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        if (plan.visibility === EnumVisibility.PRIVATE) {
            if (!authorization) {
                throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
            }

            try {
                const jwtRaw = authorization.split(' ')[1];
                const decoded = jwt.verify(jwtRaw, Constant.JWT_SECRET);
                const userId = decoded['id'];
                const role = decoded['role'];

                if (plan.owner.id !== userId && role !== EnumRoles.ROLE_ADMIN) {
                    throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
                }
            } catch (error) {
                if (error instanceof ApplicationException) {
                    throw error;
                }
                throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
            }
        }

        plan.schedule = plan.schedule.map(schedule => {
            schedule.items = schedule.items.sort((a, b) => a.order - b.order);
            return schedule;
        });

        return plan;
    }

    async findByOwner(userId: number): Promise<Plan[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        return this.planRepository.find({
            where: {
                owner: {
                    id: userId
                },
            },
            withDeleted: false,
            relations: ['owner', 'location', 'savedServices', 'schedule', 'schedule.location', 'schedule.items', 'schedule.items.service'],
        });
    }

    async create(userId: number, dto: Plan_CreateDto): Promise<Plan> {
        const location = await this.locationRepository.findOne({
            where: { id: dto.locationId },
            withDeleted: false,
        });

        if (!location) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.LOCATION_NOT_FOUND);
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
            withDeleted: false,
        });

        if (!user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_NOT_FOUND);
        }

        if (!dto.startDate || !dto.endDate) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.START_DATE_END_DATE_REQUIRED);
        }

        if (dto.startDate > dto.endDate) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.START_DATE_END_DATE_WRONG);
        }

        const res = await this.planRepository.save({
            ...dto,
            owner: user,
            location: location,
        });

        // Create Plan Schedule for each day from start date to end date
        try {
            const schedule: PlanSchedule[] = [];
            const totalDays = Math.floor((dto.endDate.getTime() - dto.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            for (let dc = 1; dc <= totalDays; dc++) {
                const scheduleItem = new PlanSchedule();
                scheduleItem.day = dc;
                scheduleItem.location = location;
                scheduleItem.plan = res;
                schedule.push(scheduleItem);
            }
            await this.planScheduleRepository.save(schedule);
        } catch (error) {
            await this.planRepository.remove(res);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_SCHEDULE_CREATE_FAILED);
        }

        return res;
    }

    async update(id: number, dto: Plan_UpdateDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id },
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        if (dto.locationId) {
            const location = await this.locationRepository.findOne({
                where: { id: dto.locationId },
                withDeleted: false,
            });

            if (!location) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.LOCATION_NOT_FOUND);
            }

            plan.location = location;
        }

        if (dto.startDate && dto.endDate) {
            if (dto.startDate > dto.endDate) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.START_DATE_END_DATE_WRONG);
            }

            // Update Plan Schedule for each day from start date to end date
            const planSchedules = await this.planScheduleRepository.find({
                relations: ['plan'],
                where: {
                    plan: {
                        id: id
                    },
                },
                withDeleted: false,
            });

            const totalDays = Math.floor((dto.endDate.getTime() - dto.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            if (totalDays < planSchedules.length) {
                // Remove Plan Schedule
                await this.planScheduleRepository.delete({
                    plan: {
                        id: id,
                    },
                    day: MoreThan(totalDays)
                });
            } else if (totalDays > planSchedules.length) {
                // Add Plan Schedule
                const schedule: PlanSchedule[] = [];
                for (let dc = planSchedules.length + 1; dc <= totalDays; dc++) {
                    const scheduleItem = new PlanSchedule();
                    scheduleItem.day = dc;
                    scheduleItem.plan = plan;
                    scheduleItem.location = plan.location;
                    schedule.push(scheduleItem);
                }
                await this.planScheduleRepository.save(schedule);
            }
        } else if (dto.startDate || dto.endDate) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.START_DATE_END_DATE_REQUIRED);
        }

        return await this.planRepository.save({
            ...plan,
            ...dto,
        });
    }

    async delete(id: number): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            relations: ['schedule', 'savedServices'],
            where: { id },
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        return await this.planRepository.softRemove(plan, { reload: true });
    }

    async saveServiceToPlan(dto: Plan_SaveItemDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            relations: ['savedServices'],
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        const service = await this.serviceRepository.findOne({
            where: { id: dto.serviceId },
            withDeleted: false,
        });

        if (!service) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        plan.savedServices = [...plan.savedServices, service];

        // Remove duplicates
        plan.savedServices = plan.savedServices.filter((service, index, self) =>
            index === self.findIndex((t) => (
                t.id === service.id
            ))
        );

        return await this.planRepository.save(plan);
    }

    async removeSavedServiceFromPlan(dto: Plan_RemoveSavedItemDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            relations: ['savedServices'],
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        plan.savedServices = plan.savedServices.filter(savedService => savedService.id !== dto.serviceId) || [];

        return await this.planRepository.save(plan);
    }

    async setPlanScheduleLocation(dto: PlanSchedule_SetLocationDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            relations: ['schedule'],
            withDeleted: false,
        });

        const planSchedule = await this.planScheduleRepository.find({
            relations: ['plan'],
            where: {
                plan: {
                    id: dto.planId,
                },
                day: In(dto.days),
            },
            withDeleted: false,
        });

        if (dto.locationId) {
            const location = await this.locationRepository.findOne({
                where: { id: dto.locationId },
                withDeleted: false,
            });

            if (!location) {
                throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.LOCATION_NOT_FOUND);
            }

            for (const schedule of planSchedule) {
                schedule.location = location;
            }
        } else {
            for (const schedule of planSchedule) {
                schedule.location = null;
            }
        }

        await this.planScheduleRepository.save(planSchedule);

        return plan;
    }

    async addPlanScheduleItem(dto: PlanSchedule_AddItemDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        const planSchedule = await this.planScheduleRepository.find({
            relations: ['plan'],
            where: {
                plan: {
                    id: dto.planId,
                },
                day: In(dto.days),
            },
            withDeleted: false,
        });

        if (!planSchedule) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_SCHEDULE_NOT_FOUND);
        }

        const service = await this.serviceRepository.findOne({
            where: { id: dto.serviceId },
            withDeleted: false,
        });

        if (!service) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.SERVICE_NOT_FOUND);
        }

        for (const schedule of planSchedule) {
            const planScheduleItem = new PlanScheduleItem();
            planScheduleItem.schedule = schedule;
            planScheduleItem.service = service;
            planScheduleItem.startTime = dto.startTime;
            planScheduleItem.endTime = dto.endTime;
            planScheduleItem.reservationCode = dto.reservationCode;
            planScheduleItem.note = dto.note;
            await this.planScheduleItemRepository.save(planScheduleItem);
        }

        return plan;
    }

    async removePlanScheduleItem(dto: PlanSchedule_RemoveItemDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        const planSchedule = await this.planScheduleRepository.findOne({
            relations: ['plan'],
            where: {
                plan: {
                    id: dto.planId,
                },
                day: dto.day,
            },
            withDeleted: false,
        });

        if (!planSchedule) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_SCHEDULE_NOT_FOUND);
        }

        const planScheduleItem = await this.planScheduleItemRepository.findOne({
            relations: ['schedule', 'service'],
            where: {
                schedule: {
                    id: planSchedule.id,
                },
                service: {
                    id: dto.serviceId,
                },
            },
            withDeleted: false,
        });

        if (!planScheduleItem) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_SCHEDULE_NOT_FOUND);
        }

        await this.planScheduleItemRepository.remove(planScheduleItem);

        return plan;
    }

    async updatePlanScheduleOrder(dto: PlanScheduleItemOrderDto): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: { id: dto.planId },
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        const schedule = await this.planScheduleRepository.findOne({
            relations: ['plan', 'items'],
            where: {
                plan: {
                    id: dto.planId,
                },
                day: dto.day,
            },
            withDeleted: false,
        });

        if (!schedule) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_SCHEDULE_NOT_FOUND);
        }

        schedule.items.forEach(item => {
            item.order = dto.items.indexOf(item.id) + 1;
        });

        await this.planScheduleRepository.save(schedule);

        return plan;
    }

    async exportPlan(id: number, authorization?: string): Promise<any> {
        const plan = await this.planRepository.findOne({
            where: { id },
            relations: ['owner', 'location', 'savedServices', 'schedule', 'schedule.location', 'schedule.items', 'schedule.items.service'],
            withDeleted: false,
        });

        if (!plan) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.PLAN_NOT_FOUND);
        }

        if (plan.visibility === EnumVisibility.PRIVATE) {
            if (!authorization) {
                throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
            }

            try {
                const jwtRaw = authorization.split(' ')[1];
                const decoded = jwt.verify(jwtRaw, Constant.JWT_SECRET);
                const userId = decoded['id'];
                const role = decoded['role'];

                if (plan.owner.id !== userId && role !== EnumRoles.ROLE_ADMIN) {
                    throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
                }
            } catch (error) {
                if (error instanceof ApplicationException) {
                    throw error;
                }
                throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.PLAN_NOT_FOUND);
            }
        }

        const data = {
            tripName: plan.name,
            startDate: moment(plan.startDate).format('DD/MM/YYYY'),
            endDate: moment(plan.endDate).format('DD/MM/YYYY'),
            schedule: plan.schedule.map(schedule => ({
                day: schedule.day,
                location: schedule.location.name,
                date: moment(plan.startDate).add(schedule.day - 1, 'days').format('DD/MM/YYYY'),
                items: schedule.items.map(item => ({
                    serviceName: item.service.name,
                    serviceAddress: item.service.address,
                })),
            })),
        }
        const options = {
            format: 'A4',
            displayHeaderFooter: false,
            margin: {
                left: '10mm',
                top: '25mm',
                right: '10mm',
                bottom: '15mm',
            },
            // headerTemplate: `<div style="width: 100%; text-align: center;"><span style="font-size: 20px;">@saemhco CORP</span><br><span class="date" style="font-size:15px"><span></div>`,
            // footerTemplate:
            //     '<div style="width: 100%; text-align: center; font-size: 10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
            landscape: false,
        };
        const filePath = path.join(process.cwd(), 'templates', 'planpdf.hbs');;
        return createPdf(filePath, options, data);
    }
}