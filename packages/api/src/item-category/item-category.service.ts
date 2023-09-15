import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmItemCategory } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';

@Injectable()
export class ItemCategoryService {
  constructor(private prisma: PrismaService, private role: RoleService) {}

  async create(createItemCategoryDto: CreateItemCategoryDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmItemCategory.create({
      data: { ...createItemCategoryDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmItemCategoryWhereInput,
    Prisma.ScmItemCategoryOrderByWithAggregationInput
  >): Promise<ScmItemCategory[] | any> {
    if (!pagination) {
      return this.prisma.scmItemCategory.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmItemCategory.count({
        where: data,
      }),
      this.prisma.scmItemCategory.findMany({
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

  async update(
    id: string,
    updateItemCategoryDto: UpdateItemCategoryDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmItemCategory.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const warehouse = await this.prisma.scmItemCategory.update({
      where: { id },
      data: { ...updateItemCategoryDto, updatedBy: creatorName.accountName },
    });
    return warehouse;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmItemCategory.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmItemCategory.count();
  }
}
