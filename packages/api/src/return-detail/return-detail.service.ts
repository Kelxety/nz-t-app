import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateReturnDetailDto } from './dto/create-return-detail.dto';
import { UpdateReturnDetailDto } from './dto/update-return-detail.dto';

@Injectable()
export class ReturnDetailService {
  constructor(private role: RoleService, private prisma: PrismaService) {}

  async create(createReturnDetailDto: CreateReturnDetailDto, token: string) {
    const creator = await this.role.getRequesterName(token);
    if (!creator) throw new Error('Unathorized');
    return await this.prisma.scmReturnDtl.create({
      data: createReturnDetailDto,
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmReturnDtlWhereInput,
    Prisma.ScmReturnDtlOrderByWithAggregationInput
  >) {
    if (!pagination) {
      return this.prisma.scmReturnDtl.findMany({
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.scmReturnDtl.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmReturnDtl.findUnique({ where: { id } });
    if (!data)
      throw new NotFoundException(
        `Return details with id ${id} does not exist.`,
      );
    return data;
  }

  async update(id: string, updateReturnDetailDto: UpdateReturnDetailDto) {
    await this.prisma.scmReturnDtl.findUnique({ where: { id } });
    const data = await this.prisma.scmReturnDtl.update({
      where: { id },
      data: {
        ...updateReturnDetailDto,
      },
    });
    return data;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedData = this.prisma.scmReturnDtl.delete({ where: { id } });
    return deletedData;
  }
}
