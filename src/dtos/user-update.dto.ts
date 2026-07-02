
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

export class UserUpdateDto {

    @IsNotEmpty({ message: "userId is required" })
    userId!: number;

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsNotEmpty()
    @IsEnum(UserStatus)
    status!: UserStatus;

    @IsNotEmpty({ message: "modifiedBy is required" })
    modifiedBy!: string;

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
