import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIssuanceDto {
    @ApiProperty()
    @IsNumber()
    fyCode: number;
    
    @ApiProperty()
    @IsString()
    issRefno: string;
    
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
    @IsString()
    risId: string;
    
    @ApiProperty()
    @IsString()
    state: string;
    
    @ApiProperty()
    @IsString()
    remarks: string;
    
    @ApiProperty()
    isRis: boolean;
    
    @ApiProperty()
    isPosted: boolean;
    
    @ApiProperty()
    @IsString()
    postedBy: string;
    
    @Transform(({ value }) => value && new Date(value))
    @ApiProperty()
    @IsDate()
    postedAt: Date;
    
    id: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
