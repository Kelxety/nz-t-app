import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreateItemLocationDetailDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    itemId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    locationId: string;
}
