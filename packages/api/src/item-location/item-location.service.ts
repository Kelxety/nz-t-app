import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItemLocation } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemLocationDto } from './dto/create-item-location.dto';
import { UpdateItemLocationDto } from './dto/update-item-location.dto';

@Injectable()
export class ItemLocationService {
  constructor(private prisma: PrismaService, private role: RoleService) {}

  async create(createItemLocationDto: CreateItemLocationDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItemLocation.create({
      data: { ...createItemLocationDto, createdBy: creatorName.accountName },
      include: {
        scmWarehouse: true,
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
    Prisma.ScmItemLocationWhereInput,
    Prisma.ScmItemLocationOrderByWithAggregationInput
  >): Promise<ScmItemLocation[] | any> {
    if (!pagination) {
      return this.prisma.scmItemLocation.findMany({
        include: {
          scmWarehouse: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmItemLocation.count({
        where: data,
      }),
      this.prisma.scmItemLocation.findMany({
        include: {
          scmWarehouse: true,
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
    const data = await this.prisma.scmItemLocation.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateItemLocationDto: UpdateItemLocationDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItemLocation.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmItemLocation.update({
      where: { id },
      data: { ...updateItemLocationDto, updatedBy: creatorName.accountName },
      include: {
        scmWarehouse: true,
      },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItemLocation.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmItemLocation.count();
  }
}
