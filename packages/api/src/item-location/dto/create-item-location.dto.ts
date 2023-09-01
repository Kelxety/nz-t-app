import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateItemLocationDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    warehouseId: string;

    @ApiProperty()
    @IsString()
    locName: string;

    @ApiProperty()
    @IsString()
    state: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;

    // @ApiProperty()
    // @IsOptional()
    // warehouse: WarehouseEntity[]
}
