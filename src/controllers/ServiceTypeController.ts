import { ServiceType_CreateDto } from '@/dtos/ServiceType_CreateDto';
import { ServiceType_UpdateDto } from '@/dtos/ServiceType_UpdateDto';
import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { ServiceTypeService } from '@/services/ServiceTypeService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('service-type')
@Controller('service-type')
export class ServiceTypeController {
    constructor(private readonly serviceTypeService: ServiceTypeService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.serviceTypeService.findAll());
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceTypeService.findById(id));
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async create(@Req() req, @Res() res, @Body() dto: ServiceType_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceTypeService.create(dto));
    }

    @Put('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: ServiceType_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceTypeService.update(id, dto));
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceTypeService.delete(id));
    }
}