import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReceivingDtlDto {
    @ApiProperty()
    @IsString()
    receiveId: string;

    @ApiProperty()
    @IsString()
    itemdtlId: string;

    @ApiProperty()
    @IsNumber()
    qty: number;

    @ApiProperty()
    @IsNumber()
    cost: number;

    @ApiProperty()
    @IsNumber()
    costAmount: number;

    @ApiProperty()
    @IsString()
    lotNo: string;

    @ApiProperty()
    @IsString()
    batchNo: string;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @ApiProperty()
    @IsOptional()
    expirationDate: Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    barcodeNo: string;
}
