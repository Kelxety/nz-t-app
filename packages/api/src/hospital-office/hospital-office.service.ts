import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalOfficeDto } from './dto/create-hospital-office.dto';
import { UpdateHospitalOfficeDto } from './dto/update-hospital-office.dto';
import { HospitalOffice, Prisma } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';

@Injectable()
export class HospitalOfficeService {
  constructor(private prisma: PrismaService, private role: RoleService) {}
  async create(createHospitalOfficeDto: HospitalOffice, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');

    return await this.prisma.hospitalOffice.create({
      data: { ...createHospitalOfficeDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.HospitalOfficeWhereInput,
    Prisma.HospitalOfficeOrderByWithAggregationInput
  >): Promise<HospitalOffice[] | any> {
    if (!pagination) {
      return this.prisma.hospitalOffice.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.hospitalOffice.count({
        where: data,
      }),
      this.prisma.hospitalOffice.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);

    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.hospitalOffice.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(
        `Hospital Office with id ${id} does not exist.`,
      );
    }
    return data;
  }

  async update(
    id: string,
    updateHospitalOfficeDto: UpdateHospitalOfficeDto,
    token: string,
  ) {
    await this.findOne(id);
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.prisma.hospitalOffice.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(
        `Hospital Office with id ${id} does not exist.`,
      );
    }
    const hospitalOffice = await this.prisma.hospitalOffice.update({
      where: { id },
      data: { ...updateHospitalOfficeDto, updatedBy: creatorName.accountName },
    });
    return hospitalOffice;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedData = this.prisma.hospitalOffice.delete({ where: { id } });
    return deletedData;
  }
}
