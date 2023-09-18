import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateReceivingDtlDto } from './dto/create-receiving-dtl.dto';
import { UpdateReceivingDtlDto } from './dto/update-receiving-dtl.dto';

@Injectable()
export class ReceivingDtlService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createReceivingDtlDto: CreateReceivingDtlDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmReceiveDtl.create({
      data: { ...createReceivingDtlDto, createdBy: creatorName.accountName },
      include: {
        scmWarehouse: true,
        scmReceiveMode: true
      },
    });
  }

  findAll() {
    return `This action returns all receivingDtl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receivingDtl`;
  }

  update(id: number, updateReceivingDtlDto: UpdateReceivingDtlDto) {
    return `This action updates a #${id} receivingDtl`;
  }

  remove(id: number) {
    return `This action removes a #${id} receivingDtl`;
  }
}
