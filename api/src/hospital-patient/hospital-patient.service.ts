import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HospitalPatient, Prisma } from '@prisma/client';
import { PaginateOptions } from 'src/lib/interface';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';
import { CreateHospitalPatientDto } from './dto/create-hospital-patient.dto';
import { UpdateHospitalPatientDto } from './dto/update-hospital-patient.dto';

@Injectable()
export class HospitalPatientService {
  constructor(private prisma: PrismaService, private role: RoleService) {}
  async create(
    createHospitalPatientDto: CreateHospitalPatientDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new UnauthorizedException('Unathorized');
    return await this.prisma.hospitalPatient.create({
      data: { ...createHospitalPatientDto, createdBy: creatorName.accountName },
    });
  }

  findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.HospitalPatientWhereInput,
    Prisma.HospitalPatientOrderByWithAggregationInput
  >): Promise<HospitalPatient[]> {
    if (!pagination) {
      return this.prisma.hospitalPatient.findMany({
        include: {
          scmChargeslips: true,
        },
        where: data,
        orderBy: order,
      });
    }
    return this.prisma.hospitalPatient.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.hospitalPatient.findUnique({
      include: {
        scmChargeslips: true,
      },
      where: {
        id,
      },
    });
    if (!data)
      throw new NotFoundException(`Patient with id ${id} does not exist.`);
    return data;
  }

  async update(id: string, updateHospitalPatientDto: UpdateHospitalPatientDto) {
    const data = await this.findOne(id);
    if (!data)
      throw new NotFoundException(`Patient with id ${id} does not exist.`);
    const updatedData = this.prisma.hospitalPatient.update({
      where: { id },
      data: updateHospitalPatientDto,
    });
    return updatedData;
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    if (!patient)
      throw new NotFoundException(`Patient with id ${id} does not exist.`);
    return `This action removes a #${id} hospitalPatient`;
  }
}
