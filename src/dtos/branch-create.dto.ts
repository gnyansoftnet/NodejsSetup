import {
    IsString, IsNotEmpty, IsOptional, MaxLength,
    IsEmail, Matches, IsEnum
} from "class-validator";
import { Transform } from "class-transformer";

export class BranchCreateDto {

    @IsNotEmpty({ message: "branchName can not be empty" })
    @Transform(({ value }) => value?.trim())
    branchName!: string;

    @IsNotEmpty({ message: "branchShortName can not be empty" })
    @Transform(({ value }) => value?.trim())
    branchShortName!: string;

    @IsNotEmpty({ message: "createdBy can not be empty" })
    createdBy!: string;

    @IsNotEmpty({ message: "orgId can not be empty" })
    orgId!: number;
}