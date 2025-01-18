import { EnumOpeningDay, EnumOpeningHours } from '@/enums/EnumOpening';
import { EnumPriceRange } from '@/enums/EnumPriceRange';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

class OpeningHours {
    @ApiProperty({ enum: EnumOpeningDay })
    @IsEnum(EnumOpeningDay)
    day: EnumOpeningDay;

    @ApiProperty({ enum: EnumOpeningHours })
    @IsEnum(EnumOpeningHours)
    hours: EnumOpeningHours;

    @ApiProperty()
    customHours?: {
        open: string;
        close: string;
    };
}

export class Service_CreateDto {
    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ required: false })
    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false })
    @IsUrl()
    @IsOptional()
    website?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    mapMarker?: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({ enum: EnumPriceRange, default: EnumPriceRange.CHEAP, required: true })
    @IsEnum(EnumPriceRange)
    @IsNotEmpty()
    priceRange: EnumPriceRange;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    price?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    serviceTypeId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    locationId: number;

    @ApiProperty({ type: 'array', items: { type: 'object' } })
    openingHours: OpeningHours[];
}

export class Service_UpdateDto extends Service_CreateDto {
}