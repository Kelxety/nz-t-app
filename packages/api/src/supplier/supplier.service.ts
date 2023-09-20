import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmSupplier } from '@prisma/client';
import { PaginateOptions } from '../lib/interface';
import { PrismaService } from '../lib/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService, private role: RoleService) { }

  async create(createSupplierDto: CreateSupplierDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Error in token');
    const find = await this.prisma.scmSupplier.findUnique({
      where: {
        supplierName: createSupplierDto.supplierName,
      },
    });
    if (find) {
      throw new ConflictException(find.supplierName);
    }
    return await this.prisma.scmSupplier.create({
      data: { ...createSupplierDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmSupplierWhereInput,
    Prisma.ScmSupplierOrderByWithAggregationInput
  >): Promise<ScmSupplier[] | any> {
    if (!pagination) {
      return this.prisma.scmSupplier.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmSupplier.count({
        where: data,
      }),
      this.prisma.scmSupplier.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmSupplier.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    return data;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.scmSupplier.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`${id} does not exist.`);
    }
    const res = await this.prisma.scmSupplier.update({
      where: { id },
      data: { ...updateSupplierDto, updatedBy: creatorName.accountName },
    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.scmSupplier.delete({ where: { id } });
    return deletedData;
  }

  async count() {
    return this.prisma.scmSupplier.count();
  }
}
