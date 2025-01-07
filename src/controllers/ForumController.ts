import { ForumPost_CreateDto, ForumPost_UpdateDto } from '@/dtos/ForumPost_Dtos';
import { RoleGuard } from '@/guards/RoleGuard';
import { ForumService } from '@/services/ForumService';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('forum')
@Controller('forum')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: ForumPost_CreateDto) {
        return res.status(HttpStatus.OK).json(await this.forumService.create(req.user.id, dto));
    }

    @Post('/follow/:id')
    async follow(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.follow(req.user.id, id));
    }

    @Delete('/follow/:id')
    async unfollow(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.unfollow(req.user.id, id));
    }

    @Post('/like/:id')
    async like(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.react(req.user.id, id));
    }

    @Delete('/like/:id')
    async unlike(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.unreact(req.user.id, id));
    }
    
    @Get('/list')
    async findAll(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.forumService.findAll());
    }

    @Get('/main')
    async getMainTopic(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.forumService.findMainTopics());
    }

    @Get('/list/following')
    async findFollowing(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.forumService.getFollowing(req.user.id));
    }

    @Get('/list/followers')
    async findFollowers(@Req() req, @Res() res) {
        return res.status(HttpStatus.OK).json(await this.forumService.getFollowers(req.user.id));
    }

    @Get('/:id/liked')
    async findLiked(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.getReacts(id));
    }

    @Get('/:id')
    async findById(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.findById(id));
    }

    @Put('/:id')
    async update(@Req() req, @Res() res, @Param('id') id: number, @Body() dto: ForumPost_UpdateDto) {
        return res.status(HttpStatus.OK).json(await this.forumService.update(id, dto));
    }

    @Delete('/:id')
    async delete(@Req() req, @Res() res, @Param('id') id: number) {
        return res.status(HttpStatus.OK).json(await this.forumService.delete(id));
    }
}