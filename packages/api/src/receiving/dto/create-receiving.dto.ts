import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateReceivingDto {

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    fyCode: number;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @ApiProperty()
    @IsOptional()
    rcvDate: Date;

    @ApiProperty()
    @IsString()
    rcvRefno: string;

    @ApiProperty()
    @IsString()
    warehouseId: string;

    @ApiProperty()
    @IsString()
    supplierId: string;

    @ApiProperty()
    @IsString()
    receivemodeId: string;

    @ApiProperty()
    @IsString()
    purchaserequestNo: string;

    @ApiProperty()
    @IsString()
    deliveryreceiptNo: string;

    @ApiProperty()
    @IsString()
    purchaseorderNo: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    remarks: string;

    @ApiProperty()
    @IsBoolean()
    isPosted: boolean;

    @ApiProperty()
    @IsString()
    postedBy: string;

    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @ApiProperty()
    @IsOptional()
    postedAt: Date;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
