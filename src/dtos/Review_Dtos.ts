import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class Review_CreateDto {
    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    serviceId: number;

    @ApiProperty({ required: true, type: Number })
    @IsNumber()
    @IsNotEmpty()
    rating: number;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    comment: string;
}

export class Review_UpdateDto extends OmitType(Review_CreateDto, ['serviceId']) {
}