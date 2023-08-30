import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateItemDto {
    @ApiProperty()
    itemCode: string;

    @ApiProperty()
    @IsString()
    barcode: string;

    @ApiProperty()
    @IsString()
    itemName: string;

    @ApiProperty()
    @IsString()
    itemDescription: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    itemcategoryId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    unitId: string;

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

    // @ApiProperty()
    // @IsOptional()
    // itemDtls: ItemDetailEntity[]
}
