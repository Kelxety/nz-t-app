import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmLedgerCode } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateStockLedgerCodeDto } from './dto/create-stock-ledger-code.dto';
import { UpdateStockLedgerCodeDto } from './dto/update-stock-ledger-code.dto';

@Injectable()
export class StockLedgerCodeService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createStockLedgerCodeDto: CreateStockLedgerCodeDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    return await this.prisma.scmLedgerCode.create({
      data: { ...createStockLedgerCodeDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmLedgerCodeWhereInput,
    Prisma.ScmLedgerCodeOrderByWithAggregationInput
  >): Promise<ScmLedgerCode[] | any> {
    if (!pagination) {
      return this.prisma.scmLedgerCode.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmLedgerCode.count({
        where: data,
      }),
      this.prisma.scmLedgerCode.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmLedgerCode.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateStockLedgerCodeDto: UpdateStockLedgerCodeDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmLedgerCode.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Warehouse with id ${id} does not exist.`);
    }
    const warehouse = await this.prisma.scmLedgerCode.update({
      where: { id },
      data: { ...updateStockLedgerCodeDto, updatedBy: creatorName.accountName },
    });
    return warehouse;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmLedgerCode.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmLedgerCode.count();
  }
}
