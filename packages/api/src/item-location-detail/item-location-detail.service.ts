import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItemLocationDtl } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemLocationDetailDto } from './dto/create-item-location-detail.dto';
import { UpdateItemLocationDetailDto } from './dto/update-item-location-detail.dto';

@Injectable()
export class ItemLocationDetailService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(
    createItemLocationDetailDto: CreateItemLocationDetailDto
  ) {
    return await this.prisma.scmItemLocationDtl.create({
      data: { ...createItemLocationDetailDto },
      include: {
        scmItemDtl: true,
        scmItemLocation: true,
      }
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmItemLocationDtlWhereInput,
    Prisma.ScmItemLocationDtlOrderByWithAggregationInput
  >): Promise<ScmItemLocationDtl[] | any> {
    if (!pagination) {
      return this.prisma.scmItemLocationDtl.findMany({
        include: {
          scmItemDtl: true,
          scmReceiveDtl: true,
          scmItemLocation: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = this.prisma.$transaction([
      this.prisma.scmItemLocationDtl.count({
        where: data,
      }),
      this.prisma.scmItemLocationDtl.findMany({
        include: {
          scmItemDtl: true,
          scmReceiveDtl: true,
          scmItemLocation: true,
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
    const data = await this.prisma.scmItemLocationDtl.findUnique({
      where: { id },
      include: {
        scmItemDtl: true,
        scmReceiveDtl: true,
        scmItemLocation: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateItemLocationDetailDto: UpdateItemLocationDetailDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItemLocationDtl.findUnique({
      where: { id },
      include: {
        scmItemDtl: true,
        scmReceiveDtl: true,
        scmItemLocation: true
      }
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmItemLocationDtl.update({
      where: { id },
      data: { ...updateItemLocationDetailDto },
      include: {
        scmReceiveDtl: true,
        scmItemDtl: true,
        scmItemLocation: true,
      },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItemLocationDtl.delete({
      where: { id },
      include: {
        scmItemDtl: true,
        scmItemLocation: true
      }
    });
    return deletedData;
  }

  async count() {
    return this.prisma.scmItemLocation.count();
  }
}
