import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreateItemLocationDetailDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    itemDtlId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    locationId: string;

    @ApiProperty()
    @IsString()
    balanceQty: string
}
