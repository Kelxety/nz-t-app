import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItemRateHistory } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemRateHistoryDto } from './dto/create-item-rate-history.dto';

@Injectable()
export class ItemRateHistoryService {
  constructor(private prisma: PrismaService, private role: RoleService) {}

  async create(
    createItemRateHistoryDto: CreateItemRateHistoryDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItemRateHistory.create({
      data: { ...createItemRateHistoryDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmItemRateHistoryWhereInput,
    Prisma.ScmItemRateHistoryOrderByWithAggregationInput
  >): Promise<ScmItemRateHistory[] | any> {
    if (!pagination) {
      return this.prisma.scmItemRateHistory.findMany({
        include: {
          scmItemDtl: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = this.prisma.$transaction([
      this.prisma.scmItemRateHistory.count({ where: data }),
      this.prisma.scmItemRateHistory.findMany({
        include: {
          scmItemDtl: true,
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
    const data = await this.prisma.scmItemCategory.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  // async update(id: string, updateItemRateHistoryDto: UpdateItemRateHistoryDto, token: string) {
  //   const creatorName = await this.role.getRequesterName(token);
  //   const data = await this.prisma.scmItemRateHistory.findUnique({ where: { id } });
  //   if (!data) {
  //     throw new NotFoundException(`Warehouse with id ${id} does not exist.`);
  //   }
  //   const warehouse = await this.prisma.scmItemCategory.update({
  //     where: { id },
  //     data: { ...updateItemRateHistoryDto, updatedBy: creatorName.accountName },
  //   });
  //   return warehouse;
  // }

  // async remove(id: string) {
  //   await this.findOne(id);

  //   const deletedData = this.prisma.scmItemCategory.delete({ where: { id } });
  //   return deletedData;
  // }

  async count() {
    return this.prisma.scmItemRateHistory.count();
  }
}
