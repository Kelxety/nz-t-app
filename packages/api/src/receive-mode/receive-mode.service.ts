import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmReceiveMode } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateReceiveModeDto } from './dto/create-receive-mode.dto';
import { UpdateReceiveModeDto } from './dto/update-receive-mode.dto';

@Injectable()
export class ReceiveModeService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createReceiveModeDto: CreateReceiveModeDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    return await this.prisma.scmReceiveMode.create({
      data: { ...createReceiveModeDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmReceiveModeWhereInput,
    Prisma.ScmReceiveModeOrderByWithAggregationInput
  >): Promise<ScmReceiveMode[] | any> {
    if (!pagination) {
      return this.prisma.scmReceiveMode.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmReceiveMode.count({
        where: data,
      }),
      this.prisma.scmReceiveMode.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmReceiveMode.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateReceiveModeDto: UpdateReceiveModeDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmReceiveMode.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmReceiveMode.update({
      where: { id },
      data: { ...updateReceiveModeDto, updatedBy: creatorName.accountName },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmReceiveMode.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmReceiveMode.count();
  }
}
