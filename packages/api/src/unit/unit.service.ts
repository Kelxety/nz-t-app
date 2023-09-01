import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmUnit } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}
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
  >): Promise<ScmUnit[]> {
    if (!pagination) {
      return await this.prisma.scmUnit.findMany({
        where: data,
        orderBy: order,
      });
    }
    return await this.prisma.scmUnit.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmUnit.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Unit with id ${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    const updatedUnit = await this.prisma.scmUnit.update({
      where: { id },
      data: updateUnitDto,
    });
    return updatedUnit;
  }

  async remove(id: string) {
    const data = await this.prisma.scmUnit.delete({ where: { id } });
    return data;
  }
}
