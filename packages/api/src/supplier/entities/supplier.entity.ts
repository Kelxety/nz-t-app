import { ApiProperty } from "@nestjs/swagger";
import { ScmSupplier } from "@prisma/client";

export class SupplierEntity implements ScmSupplier {
    constructor(partial: Partial<SupplierEntity>) {
        Object.assign(this, partial);
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    supplierName: string;

    @ApiProperty()
    supplierAddress: string;

    @ApiProperty()
    receivemodeId: string;

    @ApiProperty()
    contactPerson: string;

    @ApiProperty()
    contactNo: number;

    @ApiProperty()
    state: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    updatedAt: Date;
}
