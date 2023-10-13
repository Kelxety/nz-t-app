import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIssuanceDto } from './dto/create-issuance.dto';
import { UpdateIssuanceDto } from './dto/update-issuance.dto';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Prisma, ScmIssuance } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';

@Injectable()
export class IssuanceService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createIssuanceDto: CreateIssuanceDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    
    const createData =  await this.prisma.scmIssuance.create({
      data: { ...createIssuanceDto, createdBy: creatorName.accountName },
    });

    return await this.prisma.scmIssuance.update({
      where: { id: createData.id },
      data: { issRefno: `${new Date(createData.issDate).getFullYear()}-${new Date(createData.issDate).getMonth() + 1}-${createData.id.split('-').pop()}` }
    })
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
  Prisma.ScmIssuanceWhereInput,
  Prisma.ScmIssuanceOrderByWithAggregationInput
>): Promise<ScmIssuance[] | any> {
    if (!pagination) {
      return this.prisma.scmIssuance.findMany({
        where: data,
        include: {
          hospitalOffice: true,
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmIssuance.count({
        where: data,
      }),
      this.prisma.scmIssuance.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async fulltextSearch({
    searchData,
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
  Prisma.ScmIssuanceWhereInput,
  Prisma.ScmIssuanceOrderByWithAggregationInput
>): Promise<ScmIssuance[] | any> {
    if (!pagination) {
      return this.prisma.scmIssuance.findMany({
        where: {
          OR: [
            {
              issRefno: {
                contains: searchData
              }
            },
            {
              remarks: {
                contains: searchData
              }
            },
          ]
        },
        include: {
          hospitalOffice: true,
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmIssuance.count({
        where: {
          OR: [
            {
              issRefno: {
                contains: searchData
              }
            },
            {
              remarks: {
                contains: searchData
              }
            },
          ]
        },
      }),
      this.prisma.scmIssuance.findMany({
        where: {
          OR: [
            {
              issRefno: {
                contains: searchData
              }
            },
            {
              remarks: {
                contains: searchData
              }
            },
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
    const data = await this.prisma.scmIssuance.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Issuance with id ${id} does not exist.`);
    }
    return data;
  }

  async update(
    id: string,
    updateIssuanceDto: UpdateIssuanceDto,
    token: string,
  ) {
    await this.findOne(id);
    const creator = await this.role.getRequesterName(token);
    const data = await this.prisma.scmIssuance.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Issuance with id ${id} does not exist.`);
    }
    const issuance = await this.prisma.scmIssuance.update({
      where: { id },
      data: { ...updateIssuanceDto, updatedBy: creator.accountName },
    });
    return issuance;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmIssuance.delete({ where: { id } });
    return deletedData;
  }
}
