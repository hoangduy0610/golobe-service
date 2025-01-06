import { Location_CreateDto, Location_UpdateDto } from '@/dtos/Location_Dtos';
import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { LocationService } from '@/services/LocationService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
@Role(EnumRoles.ROLE_ADMIN)
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.locationService.findAll());
    }
    
    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: Location_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.locationService.create(dto));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.locationService.findById(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Location_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.locationService.update(id, dto));
    }

    @Delete('/:id')
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.locationService.delete(id));
    }
}