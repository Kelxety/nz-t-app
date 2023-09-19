import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateSupplierDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    supplierName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    supplierAddress: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    receivemodeId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    contactPerson: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    contactNo: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    remarks: string;


    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;

}
