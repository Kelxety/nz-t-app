import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateSupplierDto {
    @ApiProperty()
    @IsString()
    supplierName: string;

    @ApiProperty()
    @IsString()
    supplierAddress: string;

    @ApiProperty()
    @IsString()
    receivemodeId: string;

    @ApiProperty()
    @IsString()
    contactPerson: string;

    @ApiProperty()
    @IsNumber()
    contactNo: number;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    remarks: string;


    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;

}
