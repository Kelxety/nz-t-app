import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemRateHistoryDto {

    @IsOptional()
    @ApiProperty()
    itemdtlId: string;

    @IsNumber()
    @ApiProperty()
    lastCost: number;

    @IsNumber()
    @ApiProperty()
    lastPrice: number;

    @IsNumber()
    @ApiProperty()
    lastMarkup: number;

    @IsNumber()
    @ApiProperty()
    cost: number;

    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    markup: number;

    @IsString()
    @ApiProperty()
    state: string;

    @IsString()
    @ApiProperty()
    remarks: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;

    // @ApiProperty()
    // itemDtls: ItemDetailEntity[];
}
