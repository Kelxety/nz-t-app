import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItem } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createItemDto: CreateItemDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItem.create({
      data: { ...createItemDto, createdBy: creatorName.accountName },
      include: {
        scmItemCategory: true,
        scmItemDtl: true,
      },
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmItemWhereInput,
    Prisma.ScmItemOrderByWithAggregationInput
  >): Promise<ScmItem[]> {
    if (!pagination) {
      return this.prisma.scmItem.findMany({
        where: data,
        include: {
          scmItemCategory: true,
          scmItemDtl: {
            where: {
              balanceQty: {
                gt: 0,
              },
            },
          },
        },
        orderBy: order,
      });
    }
    return this.prisma.scmItem.findMany({
      where: data,
      include: {
        scmItemCategory: true,
        scmItemDtl: {
          where: {
            balanceQty: {
              gt: 0,
            },
          },
        },
      },
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmItem.findUnique({
      where: { id },
      include: { scmItemDtl: true, scmItemCategory: true },
    });
    if (!data) {
      throw new NotFoundException(`Item with id ${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateItemDto: UpdateItemDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItem.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Item with id ${id} does not exist.`);
    }
    const Item = await this.prisma.scmItem.update({
      where: { id },
      data: { ...updateItemDto, updatedBy: creatorName.accountName },
      include: {
        scmItemCategory: true,
        scmItemDtl: true,
      },
    });
    return Item;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItem.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmItem.count();
  }
}
