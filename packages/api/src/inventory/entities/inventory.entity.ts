import { ApiProperty } from "@nestjs/swagger";
import { ScmStockInventory } from "@prisma/client";

export class InventoryEntity implements ScmStockInventory {
    constructor(partial: Partial<InventoryEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    fyCode: number;
    
    @ApiProperty()
    invDate: Date;
    
    @ApiProperty()
    invRefno: string;
    
    @ApiProperty()
    warehouseId: string;
    
    @ApiProperty()
    description: string;
    
    @ApiProperty()
    state: string;
    
    @ApiProperty()
    remarks: string;
    
    @ApiProperty()
    isPosted: boolean;
    
    @ApiProperty()
    postedAt: Date;
    
    @ApiProperty()
    postedBy: string;

    @ApiProperty()
    createdBy: string;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedBy: string;
    
    @ApiProperty()
    updatedAt: Date;

}
