
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsEnum,
    IsDateString,
    Matches,
    MaxLength
} from "class-validator";

import { UserStatus } from "../constants/user-status.enum";

export class UserCreateDto {

    @IsNotEmpty({ message: "userName cannot be empty" })
    @MaxLength(100)
    userName!: string;

    @IsNotEmpty({ message: "password cannot be empty" })
    password!: string;


    @IsNotEmpty({ message: "status cannot be empty" })
    @IsEnum(UserStatus, {
        message: "status must be a valid UserStatus"
    })
    status?: UserStatus;

    @IsOptional()
    @IsEmail({}, {
        message: "email must be a valid email address"
    })
    email?: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, {
        message: "phoneNumber must contain exactly 10 digits"
    })
    phoneNumber?: string;

    @IsOptional()
    profilePic?: string;

    @IsOptional()
    @IsDateString({}, {
        message: "DOB must be a valid date (YYYY-MM-DD)"
    })
    DOB?: string;

    @IsOptional()
    createdBy?: string;
}
