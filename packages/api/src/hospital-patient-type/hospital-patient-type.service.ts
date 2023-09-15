import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalPatientType, Prisma } from '@prisma/client';
import { CreateHospitalPatientTypeDto } from './dto/create-hospital-patient-type.dto';
import { UpdateHospitalPatientTypeDto } from './dto/update-hospital-patient-type.dto';

@Injectable()
export class HospitalPatientTypeService {
  constructor(private prisma: PrismaService, private role: RoleService) {}
  async create(
    createHospitalPatientTypeDto: CreateHospitalPatientTypeDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const createdData = await this.prisma.hospitalPatientType.create({
      include: {
        scmChargeslips: true,
      },
      data: {
        ...createHospitalPatientTypeDto,
        createdBy: creatorName.accountName,
      },
    });

    if (!createdData) {
      throw new Error('Sorry there`s an Error');
    }

    return createdData;
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.HospitalPatientTypeWhereUniqueInput,
    Prisma.HospitalPatientTypeOrderByWithAggregationInput
  >): Promise<HospitalPatientType[] | any> {
    if (!pagination) {
      return this.prisma.hospitalPatientType.findMany({
        include: {
          scmChargeslips: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const resData = await this.prisma.$transaction([
      this.prisma.hospitalPatientType.count({
        where: data,
      }),
      this.prisma.hospitalPatientType.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
        include: {
          scmChargeslips: true,
        },
      }),
    ]);

    return resData;
  }

  async findOne(id: string) {
    const data = await this.prisma.hospitalPatientType.findUnique({
      include: {
        scmChargeslips: true,
      },
      where: {
        id,
      },
    });
    if (!data) throw new NotFoundException('Hospital Patient Type not Found!');
    return data;
  }

  async update(
    id: string,
    updateHospitalPatientTypeDto: UpdateHospitalPatientTypeDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    const data = await this.findOne(id);
    if (!data) {
      throw new NotFoundException(
        `Hospital type with id ${id} does not exist.`,
      );
    }

    return this.prisma.hospitalPatientType.update({
      where: { id },
      data: {
        ...updateHospitalPatientTypeDto,
        updatedBy: creatorName.accountName,
      },
    });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    if (!data)
      throw new NotFoundException(
        `Hospital Patient Type with id ${id} does not exist.`,
      );
    return await this.prisma.hospitalPatientType.delete({
      where: { id },
    });
  }
}
