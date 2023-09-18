import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

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

    @ApiProperty()
    @IsString()
    expirationDate: Date;

    @ApiProperty()
    @IsString()
    barcodeNo: string;
}
