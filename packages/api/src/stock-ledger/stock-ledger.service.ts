import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmStockLedger } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { UpdateStockLedgerDto } from './dto/update-stock-ledger.dto';
import { CreateStockLedgerDto } from './dto/create-stock-ledger.dto';

export interface AuditData {
  id: number;
  newId: number;
  userid: string;
  checktime: Date;
}

@Injectable()
export class StockLedgerService {
  constructor(
    private prisma: PrismaService,
    private role: RoleService,
  ) {}

  async create(createStockLedgerDto: { data: CreateStockLedgerDto[] }) {
    const data = await this.prisma.scmStockLedger.createMany({
      data: createStockLedgerDto.data,
      skipDuplicates: true,
    });
    return data;
  }

  async createMany(createStockLedgerDto: { data: AuditData[] }) {
    const data = await this.prisma.newaudit.createMany({
      data: createStockLedgerDto.data,
      skipDuplicates: true,
    });
    return data;
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
          scmWarehouse: true,
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
          scmWarehouse: true,
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
        scmWarehouse: true,
      },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateStockLedgerDto: UpdateStockLedgerDto,
    token: string,
  ) {
    console.log(token);
    const data = await this.prisma.scmStockLedger.findUnique({
      where: { id },
      include: {
        scmWarehouse: true,
      },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmStockLedger.update({
      where: { id },
      include: {
        scmWarehouse: true,
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
        scmWarehouse: true,
      },
    });
    return deletedData;
  }
}
