import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIssuanceDto {

    @ApiProperty()
    @IsNumber()
    totalQty: number;

    @ApiProperty()
    @IsNumber()
    totalAmount: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    fyCode: number;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    issRefno: string;
    
    @Transform(({ value }) => value && new Date(value))
    @ApiProperty()
    @IsDate()
    issDate: Date;
    
    @ApiProperty()
    @IsString()
    warehouseId: string;
    
    @ApiProperty()
    @IsString()
    officeId: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    risId: string;
    
    @ApiProperty()
    @IsString()
    state: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    remarks: string;
    
    @ApiProperty()
    @IsOptional()
    isRis: boolean;
    
    @ApiProperty()
    @IsOptional()
    isPosted: boolean;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    postedBy: string;
    
    @Transform(({ value }) => value && new Date(value))
    @ApiProperty()
    @IsOptional()
    @IsDate()
    postedAt: Date;
    
    id: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
