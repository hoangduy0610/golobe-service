import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class ForumPost_CreateDto {
    @ApiProperty({ required: true, type: String })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ required: false, type: Number })
    @IsNumber()
    @IsOptional()
    replyToId?: number;
}

export class ForumPost_UpdateDto extends ForumPost_CreateDto {
}