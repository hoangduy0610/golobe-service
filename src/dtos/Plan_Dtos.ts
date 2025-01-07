import { ApplicationException } from "@/controllers/ExceptionController";
import { EnumVisibility } from "@/enums/EnumVisibility";
import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import * as moment from 'moment';

export class Plan_CreateDto {
    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, type: String })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    locationId: number;

    @ApiProperty({ enum: EnumVisibility })
    @IsEnum(EnumVisibility)
    visibility: EnumVisibility;

    @ApiProperty({ required: true, type: Date })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value || !moment(value).isValid()) throw new ApplicationException(HttpStatus.BAD_REQUEST, 'Invalid Date');
        return moment(value).toDate()
    })
    startDate: Date;

    @ApiProperty({ required: true, type: Date })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value || !moment(value).isValid()) throw new ApplicationException(HttpStatus.BAD_REQUEST, 'Invalid Date');
        return moment(value).toDate()
    })
    endDate: Date;
}

export class Plan_UpdateDto extends Plan_CreateDto {
}

export class Plan_SaveItemDto {
    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    serviceId: number;
}

export class Plan_RemoveSavedItemDto extends Plan_SaveItemDto {
}