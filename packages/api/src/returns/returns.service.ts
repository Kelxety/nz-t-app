import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmReturn } from '@prisma/client';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(private role: RoleService, private prisma: PrismaService) {}
  async create(createReturnDto: CreateReturnDto, token: string) {
    const creator = await this.role.getRequesterName(token);
    if (!creator) throw new Error('Unathorized');
    return await this.prisma.scmReturn.create({
      data: { ...createReturnDto, createdBy: creator.accountName },
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmReturnWhereInput,
    Prisma.ScmReturnOrderByWithAggregationInput
  >): Promise<ScmReturn[]> {
    if (!pagination) {
      return this.prisma.scmReturn.findMany({
        include: {
          scmChargeslip: true,
          scmReturnDtls: true,
          scmWarehouse: true,
        },
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.scmReturn.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmReturn.findUnique({
      include: {
        scmChargeslip: true,
        scmReturnDtls: true,
        scmWarehouse: true,
      },
      where: {
        id,
      },
    });
    if (!data) throw new NotFoundException(`Return with id ${id} not found!`);
    return data;
  }

  async update(id: string, updateReturnDto: UpdateReturnDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    await this.findOne(id);
    const data = await this.prisma.scmReturn.update({
      where: {
        id,
      },
      data: {
        ...updateReturnDto,
        updatedBy: creatorName.accountName,
      },
    });
    return data;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmReturn.delete({ where: { id } });
    return deletedData;
  }
}
