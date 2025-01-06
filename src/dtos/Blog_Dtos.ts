import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class Blog_CreateDto {
    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNumber({}, { each: true })
    linkedServiceIds: number[];
}

export class Blog_UpdateDto extends Blog_CreateDto {
}