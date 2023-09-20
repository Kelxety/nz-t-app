import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReceiveModeDto {
    @ApiProperty()
    @IsString()
    recvMode: string;

    @ApiProperty()
    @IsString()
    state: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
