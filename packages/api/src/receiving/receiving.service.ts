import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmReceive } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateReceivingDto } from './dto/create-receiving.dto';
import { UpdateReceivingDto } from './dto/update-receiving.dto';

@Injectable()
export class ReceivingService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createReceivingDto: CreateReceivingDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmReceive.create({
      data: { ...createReceivingDto, createdBy: creatorName.accountName },
      include: {
        scmWarehouse: true,
        scmReceiveMode: true
      },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmReceiveWhereInput,
    Prisma.ScmReceiveOrderByWithAggregationInput
  >): Promise<ScmReceive[] | any> {
    if (!pagination) {
      return this.prisma.scmReceive.findMany({
        include: {
          scmWarehouse: true,
          scmReceiveMode: true,
          scmSupplier: true
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmReceive.count({
        where: data,
      }),
      this.prisma.scmReceive.findMany({
        include: {
          scmWarehouse: true,
          scmReceiveMode: true,
          scmSupplier: true
        },
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmReceive.findUnique({
      where: { id },
      include: {
        scmReceiveMode: true,
        scmWarehouse: true,
        scmSupplier: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateReceivingDto: UpdateReceivingDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmReceive.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmReceive.update({
      where: { id },
      data: { ...updateReceivingDto, updatedBy: creatorName.accountName },
      include: {
        scmWarehouse: true,
        scmReceiveMode: true,
        scmSupplier: true
      },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmReceive.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmReceive.count();
  }
}
