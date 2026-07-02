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
    orgId!: number;

    @IsInt()
    branchId!: number;

    @IsInt()
    roleId!: number;
}

export class UserUpdateDto {

    @IsInt()
    @IsNotEmpty()
    userId!: number;

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsEnum(UserStatus)
    status!: UserStatus;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/)
    phoneNumber?: string;

    @IsOptional()
    fullName?: string;

    @IsString()
    @IsNotEmpty()
    modifiedBy!: string;

    @ValidateNested({ each: true })
    @Type(() => UserAssignmentDto)
    @ArrayMinSize(1)
    assignments!: UserAssignmentDto[];
}