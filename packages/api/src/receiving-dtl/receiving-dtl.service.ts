import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmReceiveDtl } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
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
      data: { ...createReceivingDtlDto },
      include: {
        scmReceive: true,
        scmItemDtl: true
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
    Prisma.ScmReceiveDtlWhereInput,
    Prisma.ScmReceiveDtlOrderByWithAggregationInput
  >): Promise<ScmReceiveDtl[] | any> {
    if (!pagination) {
      return this.prisma.scmReceiveDtl.findMany({
        include: {
          scmItemDtl: true,
          scmReceive: true
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmReceiveDtl.count({
        where: data,
      }),
      this.prisma.scmReceiveDtl.findMany({
        include: {
          scmItemDtl: true,
          scmReceive: true
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
    const data = await this.prisma.scmReceiveDtl.findUnique({
      where: { id },
      include: {
        scmItemDtl: true,
        scmReceive: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateReceivingDtlDto: UpdateReceivingDtlDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmReceiveDtl.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmReceiveDtl.update({
      where: { id },
      data: { ...updateReceivingDtlDto },
      include: {
        scmItemDtl: true,
        scmReceive: true
      },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmReceiveDtl.delete({ where: { id } });
    return deletedData;
  }
}
