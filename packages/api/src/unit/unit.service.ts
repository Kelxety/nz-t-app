import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmUnit } from '@prisma/client';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService, private role: RoleService) { }
  async create(createUnitDto: CreateUnitDto) {
    return await this.prisma.scmUnit.create({ data: createUnitDto });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmUnitWhereInput,
    Prisma.ScmUnitOrderByWithAggregationInput
  >): Promise<ScmUnit[] | any> {
    if (!pagination) {
      return await this.prisma.scmUnit.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmUnit.count({
        where: data,
      }),
      this.prisma.scmUnit.findMany({
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
  }: PaginateOptions<
    Prisma.ScmUnitWhereInput,
    Prisma.ScmUnitOrderByWithAggregationInput
  >): Promise<ScmUnit[] | any> {
    if (!pagination) {
      return await this.prisma.scmUnit.findMany({
        where: {
          OR: [
            {
              unitAcro: {
                contains: searchData
              }
            },
            {
              unitName: {
                contains: searchData
              }
            }
          ]
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmUnit.count({
        where: {
          OR: [
            {
              unitAcro: {
                contains: searchData
              }
            },
            {
              unitName: {
                contains: searchData
              }
            }
          ]
        },
      }),
      this.prisma.scmUnit.findMany({
        where: {
          OR: [
            {
              unitAcro: {
                contains: searchData
              }
            },
            {
              unitName: {
                contains: searchData
              }
            }
          ]
        },
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmUnit.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Unit with id ${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto, token: string) {
    await this.findOne(id);
    const creator = await this.role.getRequesterName(token);
    const updatedUnit = await this.prisma.scmUnit.update({
      where: { id },
      data: { ...updateUnitDto, updatedBy: creator.accountName },
    });
    return updatedUnit;
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.prisma.scmUnit.delete({ where: { id } });
    return data;
  }
}
