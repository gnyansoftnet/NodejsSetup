import {
    IsString, IsNotEmpty, IsOptional, MaxLength,
    IsEmail, Matches, IsEnum
} from "class-validator";
import { Transform } from "class-transformer";

export class OrgCreateDto {
    @IsNotEmpty({ message: "orgName can not be empty" })
    @Transform(({ value }) => value?.trim())
    orgName!: string

    @IsNotEmpty({ message: "organisation orgShortName can not be blank" })
    @Transform(({ value }) => value?.trim().toUpperCase())
    orgShortName!: string;

    @IsNotEmpty({ message: "created by can not be blank" })
    createdBy!: string;

    @IsOptional()
    address?: string;

    @IsOptional()
    faxNumber?: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: "orgPhone must be 10 digits" })
    orgPhone?: string;


    @IsOptional()
    orgEmail?: string;


    @IsOptional()
    website?: string;

    @IsOptional()
    tinNumber?: string;

    @IsOptional()
    orgGSTINNumber?: string;

    @IsOptional()
    orgPAN?: string;

    @IsOptional()
    serviceTax: string;

    @IsOptional()
    orgRegNumber?: string;

    @IsOptional()
    tanNumber?: string;

    @IsOptional()
    cashAccountNumber?: string;

    @IsOptional()
    logo?: string;

}