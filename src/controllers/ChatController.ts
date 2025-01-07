import { EnumRoles } from '@/enums/EnumRoles';
import { Role } from '@/guards/RoleDecorator';
import { RoleGuard } from '@/guards/RoleGuard';
import { ChatService } from '@/services/ChatService';
import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';

class ChatDto {
    @ApiProperty()
    message: string;
}

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
@Role(EnumRoles.ROLE_ADMIN)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('/')
    async create(@Req() req, @Res() res, @Body() dto: ChatDto) {
        return res.status(HttpStatus.OK).json(await this.chatService.processUserMessage(dto.message));
    }
}