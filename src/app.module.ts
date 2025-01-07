import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/AuthModule';
import typeorm from './commons/TypeORMConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envFiles } from './commons/Constant';
import { LocationModule } from './modules/LocationModule';
import { ServiceTypeModule } from './modules/ServiceTypeModule';
import { ServiceModule } from './modules/ServiceModule';
import { PlanModule } from './modules/PlanModule';
import { ReviewModule } from './modules/ReviewModule';
import { ForumModule } from './modules/ForumModule';
import { BlogModule } from './modules/BlogModule';
import { FileModule } from './modules/FileModule';
import { UserModule } from './modules/UserModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFiles,
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    FileModule,
    AuthModule,
    LocationModule,
    ServiceTypeModule,
    ServiceModule,
    PlanModule,
    ReviewModule,
    ForumModule,
    BlogModule,
    UserModule,
  ]
})
export class AppModule { }