import { Service_CreateDto, Service_UpdateDto } from '@/dtos/Service_Dtos';
import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { ServiceService } from '@/services/ServiceService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.serviceService.findAll());
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async create(@Req() req, @Res() res, @Body() dto: Service_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceService.create(dto));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceService.findById(id));
    }

    @Put('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Service_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceService.update(id, dto));
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth()
    @Role(EnumRoles.ROLE_ADMIN)
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceService.delete(id));
    }
}