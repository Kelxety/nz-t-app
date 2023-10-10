import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateStockLedgerCodeDto {

    @ApiProperty()
    @IsString()
    ledgerCode: string;

    @ApiProperty()
    @IsString()
    ledgerName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    ledgerDesc: string;

    @ApiProperty()
    @IsString()
    ledgerFlag: string;

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
