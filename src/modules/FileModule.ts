import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as moment from 'moment';
import { FileController } from '@/controllers/FileController';

// create 'uploads' file to root
const uploadDir = join(process.cwd(), 'uploads');
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          let filename = `${moment().format("YYYYMMDD_HHmmss_SSSSSSSS")}${ext}`;
          switch (file.mimetype) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
            case 'image/webp':
            case 'image/svg+xml':
            case 'image/x-icon':
            case 'image/vnd.microsoft.icon':
            case 'image/vnd.wap.wbmp':
            case 'image/bmp':
            case 'image/tiff':
              filename = `IMG_${filename}`;
              break;
            case 'video/mp4':
            case 'video/x-msvideo':
            case 'video/x-ms-wmv':
            case 'video/mpeg':
            case 'video/quicktime':
            case 'video/x-flv':
            case 'video/x-ms-wmv':
              filename = `VID_${filename}`;
              break;
            default:
              break;
          }
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/gif' ||
          file.mimetype === 'image/webp' ||
          file.mimetype === 'image/svg+xml' ||
          file.mimetype === 'image/x-icon' ||
          file.mimetype === 'image/vnd.microsoft.icon' ||
          file.mimetype === 'image/vnd.wap.wbmp' ||
          file.mimetype === 'image/bmp' ||
          file.mimetype === 'image/tiff' ||
          file.mimetype === 'image/tiff' ||
          file.mimetype === 'video/mp4' ||
          file.mimetype === 'video/x-msvideo' ||
          file.mimetype === 'video/x-ms-wmv' ||
          file.mimetype === 'video/mpeg' ||
          file.mimetype === 'video/quicktime' ||
          file.mimetype === 'video/x-flv' ||
          file.mimetype === 'video/x-ms-wmv'
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only images and video are allowed...'), false);
        }
      },
    }),
  ],
  controllers: [
    FileController,
  ],
  providers: [],
})
export class FileModule { }