import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    fyCode: number;
    
    @ApiProperty()
    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    invDate: Date;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    invRefno: string;
    
    @ApiProperty()
    @IsString()
    warehouseId: string;
    
    @ApiProperty()
    @IsString()
    description: string;
    
    @ApiProperty()
    @IsString()
    state: string;
    
    @ApiProperty()
    @IsString()
    remarks: string;
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isPosted: boolean;
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    postedAt: Date;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    postedBy: string;

    id: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
