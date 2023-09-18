import { ApiProperty } from "@nestjs/swagger";

export class CreateReceiveModeDto {
    @ApiProperty()
    recvMode: string;

    @ApiProperty()
    state: string;

    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}
