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

  async create(createItemLocationDetailDto: CreateItemLocationDetailDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItemLocationDtl.create({
      data: { ...createItemLocationDetailDto },
      include: {
        scmItem: true,
        scmItemLocation: true
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
  >): Promise<ScmItemLocationDtl[]> {
    if (!pagination) {
      return this.prisma.scmItemLocationDtl.findMany({
        include: {
          scmItem: true,
          scmItemLocation: true
        },
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.scmItemLocationDtl.findMany({
      include: {
        scmItem: true,
        scmItemLocation: true
      },
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmItemLocationDtl.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateItemLocationDetailDto: UpdateItemLocationDetailDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItemLocationDtl.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmItemLocationDtl.update({
      where: { id },
      data: { ...updateItemLocationDetailDto },
      include: {
        scmItem: true,
        scmItemLocation: true
      }
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItemLocationDtl.delete({ where: { id } });
    return deletedData;;
  }

  async count() {
    return this.prisma.scmItemLocation.count();
  }
}
