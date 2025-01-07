import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { Auth_RegiserDto } from "./Auth_RegisterDto";
import { EnumRoles } from "@/enums/EnumRoles";

export class User_CreateDto extends Auth_RegiserDto {
    @ApiProperty({ enum: EnumRoles })
    @IsEnum(EnumRoles)
    role: EnumRoles;
}

export class User_UpdateDto extends OmitType(User_CreateDto, ['password']) {
}