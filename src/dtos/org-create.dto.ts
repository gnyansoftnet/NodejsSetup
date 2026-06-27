import {
    IsString, IsNotEmpty, IsOptional, MaxLength,
    IsEmail, Matches, IsEnum
} from "class-validator";
import { Transform } from "class-transformer";

export class OrgCreateDto {
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    orgName!: string

    @IsNotEmpty()
    @Transform(({ value }) => value?.trim().toUpperCase())
    orgShortName!: string;

    @IsNotEmpty()
    createdBy!: string;

    address: string;

    faxNumber: string;

    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: "Phone must be 10 digits" })
    orgPhone?: string;

    website: string;


    tinNumber: string;


    orgGSTINNumber: string;


    orgPAN: string;


    serviceTax: string;


    orgRegNumber: string;


    tanNumber: string;


    cashAccountNumber: string;

    logo: string;


}