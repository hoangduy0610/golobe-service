import { EnumServiceTypeFilters } from "@/enums/EnumServiceTypeFilters";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ServiceType_CreateDto {
    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, enum: EnumServiceTypeFilters, isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    filters: EnumServiceTypeFilters[];
}