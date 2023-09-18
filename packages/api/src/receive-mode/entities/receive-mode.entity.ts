import { ApiProperty } from "@nestjs/swagger";
import { ScmReceiveMode } from "@prisma/client";

export class ReceiveMode implements ScmReceiveMode {

    constructor(partial: Partial<ReceiveMode>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    recvMode: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    updatedAt: Date;
}
