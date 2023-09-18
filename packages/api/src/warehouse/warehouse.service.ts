import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmWarehouse } from '@prisma/client';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService, private role: RoleService) { }
  async create(createWarehouseDto: CreateWarehouseDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    const find = await this.prisma.scmWarehouse.findUnique({
      where: {
        whAcro: createWarehouseDto.whAcro,
      },
      select: {
        whAcro: true
      }
    });
    console.log(find)
    if (find) {
      throw new ConflictException(find.whAcro);
    }
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
  >): Promise<ScmWarehouse[] | any> {
    if (!pagination) {
      return this.prisma.scmWarehouse.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmWarehouse.count({
        where: data,
      }),
      this.prisma.scmWarehouse.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
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
    await this.findOne(id);
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
