import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmWarehouse } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService, private role: RoleService) {}
  async create(createWarehouseDto: CreateWarehouseDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    return await this.prisma.scmWarehouse.create({
      data: { ...createWarehouseDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmWarehouseWhereInput,
    Prisma.ScmWarehouseOrderByWithAggregationInput
  >): Promise<ScmWarehouse[]> {
    if (!pagination) {
      return this.prisma.scmWarehouse.findMany({
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.scmWarehouse.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmWarehouse.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Warehouse with id ${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmWarehouse.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Warehouse with id ${id} does not exist.`);
    }
    const warehouse = await this.prisma.scmWarehouse.update({
      where: { id },
      data: { ...updateWarehouseDto, updatedBy: creatorName.accountName },
    });
    return warehouse;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmWarehouse.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmWarehouse.count();
  }
}
