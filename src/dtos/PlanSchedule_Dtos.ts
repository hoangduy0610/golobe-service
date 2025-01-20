import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PlanSchedule_SetLocationDto {
    @ApiProperty({ required: false, type: Number })
    @IsNumber()
    @IsOptional()
    locationId?: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNotEmpty()
    days: number[];
}

export class PlanSchedule_AddItemDto {
    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    serviceId: number;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNotEmpty()
    days: number[];

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsOptional()
    startTime?: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsOptional()
    endTime?: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsOptional()
    reservationCode?: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsOptional()
    note?: string;
}

export class PlanSchedule_RemoveItemDto extends PickType(PlanSchedule_AddItemDto, ['planId', 'serviceId']) {
    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    day: number;
}

export class PlanScheduleItemOrderDto {
    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    day: number;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNotEmpty()
    items: number[];
}