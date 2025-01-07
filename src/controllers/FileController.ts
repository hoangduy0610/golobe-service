import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('file')
export class FileController {

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload a file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        }
    })
    async uploadImage(@Req() req, @UploadedFile() file) {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        return {
            url: fileUrl,
        };
    }
}