import {
    IsString, IsNotEmpty, IsOptional, MaxLength,
    IsEmail, Matches, IsEnum
} from "class-validator";
import { Transform } from "class-transformer";

export class BranchUpdateDto {

    @IsNotEmpty({ message: "branchId can not be empty" })
    branchId!: number;

    @IsNotEmpty({ message: "modifiedBy can not be empty" })
    modifiedBy!: string;

    @IsOptional()
    branchName?: string;

    @IsOptional()
    branchShortName?: string;


}