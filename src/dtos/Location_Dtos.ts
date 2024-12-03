import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class Location_CreateDto {
    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    featureImage: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    mapMarker?: string;
}

export class Location_UpdateDto extends Location_CreateDto {
}