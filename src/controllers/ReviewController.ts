import { Review_CreateDto, Review_UpdateDto } from '@/dtos/Review_Dtos';
import { RoleGuard } from '@/guards/RoleGuard';
import { ReviewService } from '@/services/ReviewService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('review')
@Controller('review')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.reviewService.findAll());
    }

    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: Review_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.reviewService.create(req.user.id, dto));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.reviewService.findById(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: Review_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.reviewService.update(id, dto));
    }

    @Delete('/:id')
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.reviewService.delete(id));
    }
}