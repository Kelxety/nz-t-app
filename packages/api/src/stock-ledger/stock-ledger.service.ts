import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmStockLedger } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateStockLedgerDto } from './dto/create-stock-ledger.dto';
import { UpdateStockLedgerDto } from './dto/update-stock-ledger.dto';

@Injectable()
export class StockLedgerService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createStockLedgerDto: CreateStockLedgerDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmStockLedger.create({
      data: { ...createStockLedgerDto, postedBy: creatorName.accountName, postedAt: new Date() },
      include: {
        scmItemDtl: true,
        scmItemLocationDtl: true,
        scmLedgerCode: true,
        scmWarehouse: true
      }
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmStockLedgerWhereInput,
    Prisma.ScmStockLedgerOrderByWithAggregationInput
  >): Promise<ScmStockLedger[] | any> {
    if (!pagination) {
      return this.prisma.scmStockLedger.findMany({
        where: data,
        include: {
          scmItemDtl: true,
          scmItemLocationDtl: true,
          scmLedgerCode: true,
          scmWarehouse: true
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmStockLedger.count({
        where: data,
      }),
      this.prisma.scmStockLedger.findMany({
        where: data,
        include: {
          scmItemDtl: true,
          scmItemLocationDtl: true,
          scmLedgerCode: true,
          scmWarehouse: true
        },
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmStockLedger.findUnique({
      where: { id },
      include: {
        scmItemDtl: true,
        scmItemLocationDtl: true,
        scmLedgerCode: true,
        scmWarehouse: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateStockLedgerDto: UpdateStockLedgerDto, token: string) {
    const data = await this.prisma.scmStockLedger.findUnique({
      where: { id },
      include: {
        scmItemDtl: true,
        scmItemLocationDtl: true,
        scmLedgerCode: true,
        scmWarehouse: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmStockLedger.update({
      where: { id },
      include: {
        scmItemDtl: true,
        scmItemLocationDtl: true,
        scmLedgerCode: true,
        scmWarehouse: true
      },
      data: { ...updateStockLedgerDto },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmStockLedger.delete({
      where: { id },
      include: {
        scmItemDtl: true,
        scmItemLocationDtl: true,
        scmLedgerCode: true,
        scmWarehouse: true
      }
    });
    return deletedData;
  }
}
