import {
    IsString, IsNotEmpty, IsOptional, MaxLength,
    IsEmail, Matches, IsEnum
} from "class-validator";
import { Transform } from "class-transformer";

export class OrgUpdateDto {

    @IsNotEmpty({ message: "midifiedBy by can not be blank" })
    modifiedBy!: string;

    @IsNotEmpty({ message: "orgId can not be blank" })
    orgId!: number

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    orgName?: string

    @IsOptional()
    @Transform(({ value }) => value?.trim().toUpperCase())
    orgShortName?: string;

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