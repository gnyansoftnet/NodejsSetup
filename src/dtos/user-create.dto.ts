
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsEnum,
    IsDateString,
    Matches,
    MaxLength,
    IsInt
} from "class-validator";

import { UserStatus } from "../constants/user-status.enum";

export class UserCreateDto {

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsNotEmpty()
    @IsEnum(UserStatus)
    status!: UserStatus;

    @IsNotEmpty({ message: "createdBy is required" })
    createdBy!: string;

    @IsInt()
    @IsNotEmpty()
    orgId!: number;

    @IsInt()
    @IsNotEmpty()
    branchId!: number;

    @IsInt()
    @IsNotEmpty()
    roleId!: number;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: "Phone number must be a 10-digit number" })
    phoneNumber?: string;

    @IsOptional()
    fullName?: string

}
