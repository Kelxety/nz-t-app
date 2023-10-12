import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class CreateItemLocationDetailDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    itemdtlId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    locationId: string;

    @ApiProperty()
    @IsNumber()
    balanceQty: number
}
