import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsEnum,
    Matches,
    ValidateNested,
    ArrayMinSize,
    IsInt
} from "class-validator";

import { Type } from "class-transformer";
import { UserStatus } from "../constants/user-status.enum";


export class UserAssignmentDto {

    @IsInt()
    @IsNotEmpty()
    orgId!: number;

    @IsInt()
    @IsNotEmpty()
    branchId!: number;

    @IsInt()
    @IsNotEmpty()
    roleId!: number;
}

export class UserCreateDto {

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsEnum(UserStatus)
    status!: UserStatus;

    @IsString()
    @IsNotEmpty()
    createdBy!: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, {
        message: "Phone number must be a 10-digit number",
    })
    phoneNumber?: string;

    @IsOptional()
    fullName?: string;

    @ArrayMinSize(1, {
        message: "At least one organisation assignment is required",
    })
    @ValidateNested({ each: true })
    @Type(() => UserAssignmentDto)
    assignments!: UserAssignmentDto[];
}