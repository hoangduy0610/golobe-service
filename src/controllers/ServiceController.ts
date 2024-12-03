import { Service_CreateDto, Service_UpdateDto } from '@/dtos/Service_Dtos';
import { ServiceService } from '@/services/ServiceService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.serviceService.findAll());
    }

    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: Service_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceService.create(dto));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceService.findById(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Service_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.serviceService.update(id, dto));
    }

    @Delete('/:id')
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.serviceService.delete(id));
    }
}