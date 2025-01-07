import { PlanSchedule_AddItemDto, PlanSchedule_RemoveItemDto, PlanSchedule_SetLocationDto } from '@/dtos/PlanSchedule_Dtos';
import { Plan_CreateDto, Plan_RemoveSavedItemDto, Plan_SaveItemDto, Plan_UpdateDto } from '@/dtos/Plan_Dtos';
import { RoleGuard } from '@/guards/RoleGuard';
import { PlanService } from '@/services/PlanService';
import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
    constructor(private readonly planService: PlanService) { }

    @Get('/list')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.planService.findAll());
    }

    @Get('/mine')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async findAllMine(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.planService.findByOwner(req.user.id));
    }

    @Post('/saves')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async saveItem(@Req() req, @Res() res, @Body() dto: Plan_SaveItemDto) {
        return res.status(HttpStatus.OK).json(await this.planService.saveServiceToPlan(dto));
    }

    @Delete('/saves')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async removeSavedItem(@Req() req, @Res() res, @Body() dto: Plan_RemoveSavedItemDto) {
        return res.status(HttpStatus.OK).json(await this.planService.removeSavedServiceFromPlan(dto));
    }

    @Post('/schedule/location')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async setScheduleLocation(@Req() req, @Res() res, @Body() dto: PlanSchedule_SetLocationDto) {
        return res.status(HttpStatus.OK).json(await this.planService.setPlanScheduleLocation(dto));
    }

    @Post('/schedule/item')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async setScheduleItem(@Req() req, @Res() res, @Body() dto: PlanSchedule_AddItemDto) {
        return res.status(HttpStatus.OK).json(await this.planService.addPlanScheduleItem(dto));
    }

    @Delete('/schedule/item')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async removeScheduleItem(@Req() req, @Res() res, @Body() dto: PlanSchedule_RemoveItemDto) {
        return res.status(HttpStatus.OK).json(await this.planService.removePlanScheduleItem(dto));
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async create(@Req() req, @Res() res, @Body() dto: Plan_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.planService.create(req.user.id, dto));
    }

    @Get('/:id')
    @ApiBearerAuth()
    async findById(@Req() req, @Res() res, @Param('id') id: number, @Headers('Authorization') authorization?: string) {
        return res.status(HttpStatus.OK).json(await this.planService.findById(id, authorization));
    }

    @Put('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Plan_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.planService.update(id, dto));
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.planService.delete(id));
    }
}