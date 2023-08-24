import { ApiProperty } from "@nestjs/swagger";
import { ScmItemCategory } from "@prisma/client";

export class ItemCategoryEntity implements ScmItemCategory {
    @ApiProperty()
    id: string;

    @ApiProperty()
    parentId: string;

    @ApiProperty()
    catName: string;

    @ApiProperty()
    catAcro: string;

    @ApiProperty()
    sortOrder: number;

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