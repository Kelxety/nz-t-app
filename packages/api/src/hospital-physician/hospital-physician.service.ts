import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateHospitalPhysicianDto } from './dto/create-hospital-physician.dto';
import { UpdateHospitalPhysicianDto } from './dto/update-hospital-physician.dto';
import { HospitalPhysicianEntity } from './entities/hospital-physician.entity';

@Injectable()
export class HospitalPhysicianService {
  constructor(private role: RoleService, private prisma: PrismaService) {}
  async create(
    createHospitalPhysicianDto: CreateHospitalPhysicianDto,
    token: string,
  ) {
    const creator = await this.role.getRequesterName(token);
    if (!creator) throw new Error('Token Error');
    return await this.prisma.hospitalPhysician.create({
      data: { ...createHospitalPhysicianDto, createdBy: creator.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.HospitalPhysicianWhereInput,
    Prisma.HospitalPhysicianOrderByWithAggregationInput
  >): Promise<HospitalPhysicianEntity[] | any> {
    if (!pagination) {
      return this.prisma.hospitalPhysician.findMany({
        include: {
          scmChargeslips: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.hospitalPhysician.count({
        where: data,
      }),
      this.prisma.hospitalPhysician.findMany({
        include: {
          scmChargeslips: true,
        },
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.hospitalPhysician.findUnique({
      include: {
        scmChargeslips: true,
      },
      where: {
        id,
      },
    });
    if (!data)
      throw new NotFoundException(`Physician with id ${id} not found!`);
    return data;
  }

  async update(
    id: string,
    updateHospitalPhysicianDto: UpdateHospitalPhysicianDto,
    token: string,
  ) {
    this.findOne(id);
    const creator = await this.role.getRequesterName(token);
    const data = await this.prisma.hospitalPhysician.update({
      where: {
        id,
      },
      data: {
        ...updateHospitalPhysicianDto,
        updatedBy: creator.accountName,
      },
    });
    if (!data) {
      throw new Error("There's an error in updating!");
    }
    return data;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedData = this.prisma.hospitalPhysician.update({
      where: { id },
      data: {
        state: 'Inactive',
      },
    });
    return deletedData;
  }
}
