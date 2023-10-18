import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { RoleService } from '@api/role/role.service';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { Prisma, ScmStockInventory } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';

@Injectable()
export class InventoryService {

  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createInventoryDto: CreateInventoryDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    
    const createData =  await this.prisma.scmStockInventory.create({
      data: { ...createInventoryDto, createdBy: creatorName.accountName },
    });

    return await this.prisma.scmStockInventory.update({
      where: { id: createData.id },
      data: { invRefno: `${new Date(createData.invDate).getFullYear()}-${new Date(createData.invDate).getMonth() + 1}-${createData.id.split('-').pop()}` }
    })
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmStockInventoryWhereInput,
    Prisma.ScmStockInventoryOrderByWithAggregationInput
  >): Promise<ScmStockInventory[] | any> {
    if (!pagination) {
      return this.prisma.scmStockInventory.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmStockInventory.count({
        where: data,
      }),
      this.prisma.scmStockInventory.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async fullTextSearch({
    searchData,
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<Prisma.ScmStockInventoryWhereInput, Prisma.ScmStockInventoryOrderByWithAggregationInput>): Promise<ScmStockInventory[] | any> {
    if (!pagination) {
      return this.prisma.scmStockInventory.findMany({
        where: {
          OR: [
            {
              remarks: {
                contains: searchData
              }
            }
          ],
          AND: data
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmStockInventory.count({
        where: {
          OR: [
            {
              remarks: {
                contains: searchData
              }
            }
          ],
          AND: data
        },
      }),

      this.prisma.scmStockInventory.findMany({
        where: {
          OR: [
            {
              remarks: {
                contains: searchData
              }
            }
          ],
          AND: data
        },
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmStockInventory.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmStockInventory.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const warehouse = await this.prisma.scmStockInventory.update({
      where: { id },
      data: { ...updateInventoryDto, updatedBy: creatorName.accountName },
    });
    return warehouse;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmStockInventory.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmStockInventory.count();
  }
}
