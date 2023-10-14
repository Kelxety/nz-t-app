
import { HospitalOfficeEntity } from '../../hospital-office/entities/hospital-office.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScmIssuance } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class IssuanceEntity implements ScmIssuance {
    constructor({hospitalOffice,...data}: Partial<IssuanceEntity>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    totalQty: number;

    @ApiProperty()
    totalAmount: number;

    @ApiProperty()
    id: string;
    
    @ApiProperty()
    fyCode: number;
    
    @ApiProperty()
    issRefno: string;
    
    @ApiProperty()
    issDate: Date;
    
    @ApiProperty()
    warehouseId: string;
    
    @ApiProperty()
    @Exclude()
    officeId: string;
    
    @ApiProperty()
    risId: string;
    
    @ApiProperty()
    state: string;
    
    @ApiProperty()
    remarks: string;
    
    @ApiProperty()
    isRis: boolean;
    
    @ApiProperty()
    isPosted: boolean;
    
    @ApiProperty()
    postedBy: string;
    
    @ApiProperty()
    postedAt: Date;
    
    @ApiProperty()
    createdBy: string;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedBy: string;
    
    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({type: HospitalOfficeEntity})
    hospitalOffice: HospitalOfficeEntity;
}
