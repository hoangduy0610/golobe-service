import { Blog_CreateDto, Blog_UpdateDto } from '@/dtos/Blog_Dtos';
import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { BlogService } from '@/services/BlogService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('blog')
@Controller('blog')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
@Role(EnumRoles.ROLE_ADMIN)
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.blogService.findAll());
    }

    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: Blog_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.blogService.create(req.user.id, dto));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.blogService.findById(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Blog_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.blogService.update(id, dto));
    }

    @Delete('/:id')
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.blogService.delete(id));
    }
}