import { User_CreateDto, User_UpdateDto } from '@/dtos/User_Dtos';
import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { UserService } from '@/services/UserService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('/list')
    @Role(EnumRoles.ROLE_ADMIN)
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.userService.findAll());
    }

    @Post('/')
    @Role(EnumRoles.ROLE_ADMIN)
    async create(@Req() req, @Res() res, @Body() dto: User_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.userService.create(dto));
    }

    @Get('/:id')
    @Role(EnumRoles.ROLE_ADMIN)
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.userService.findOne(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: User_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.userService.update(req.user, id, dto));
    }

    @Delete('/:id')
    @Role(EnumRoles.ROLE_ADMIN)
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.userService.delete(id));
    }
}