import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItemDtl } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';

@Injectable()
export class ItemDetailService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createItemDetailDto: CreateItemDetailDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItemDtl.create({
      data: { ...createItemDetailDto, createdBy: creatorName.accountName },
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmItemDtlWhereInput,
    Prisma.ScmItemDtlOrderByWithAggregationInput
  >): Promise<ScmItemDtl[]> {
    if (!pagination) {
      return this.prisma.scmItemDtl.findMany({
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.scmItemDtl.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmItemDtl.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateItemDetailDto: UpdateItemDetailDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItemDtl.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const warehouse = await this.prisma.scmItemDtl.update({
      where: { id },
      data: { ...updateItemDetailDto, updatedBy: creatorName.accountName },
    });
    return warehouse;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItemDtl.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmItemDtl.count();
  }
}