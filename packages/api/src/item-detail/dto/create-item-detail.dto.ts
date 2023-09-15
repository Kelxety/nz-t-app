import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDetailDto {

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    fyCode: number;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @ApiProperty()
    @IsOptional()
    entryDate: Date;

    @IsString()
    @ApiProperty()
    itemId: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    parentId: string;

    @IsString()
    @ApiProperty()
    subitemCode: string;

    @IsString()
    @ApiProperty()
    subitemName: string;

    @IsString()
    @ApiProperty()
    @ApiProperty()
    barcode: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    unitId: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    brandName: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    lotNo: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    batchNo: string;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @ApiProperty()
    @IsOptional()
    expirationDate: Date;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    cost: number;

    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    markup: number;

    @IsNumber()
    @ApiProperty()
    balanceQty: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    rrMode: string;

    @IsString()
    @ApiProperty()
    state: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    remarks: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
