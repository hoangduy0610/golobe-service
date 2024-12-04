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
    AuthModule,
    LocationModule,
    ServiceTypeModule,
    ServiceModule,
    PlanModule,
  ]
})
export class AppModule { }