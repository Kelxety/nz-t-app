import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, ScmChargeslip } from '@prisma/client';
import { CreateChargeSlipDto } from './dto/create-charge-slip.dto';
import { UpdateChargeSlipDto } from './dto/update-charge-slip.dto';

@Injectable()
export class ChargeSlipService {
  constructor(private prisma: PrismaService, private role: RoleService) {}
  async create(createChargeSlipDto: CreateChargeSlipDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    return await this.prisma.scmChargeslip.create({
      data: { ...createChargeSlipDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmChargeslipWhereInput,
    Prisma.ScmItemOrderByWithAggregationInput
  >): Promise<ScmChargeslip[]> {
    if (!pagination) {
      return this.prisma.scmChargeslip.findMany({
        where: data,
        include: {
          hospitalPatient: true,
          hospitalPatientType: true,
          hospitalPhysician: true,
          scmChargeslipDtls: true,
          scmReturns: true,
          scmWarehouse: true,
        },
        orderBy: order,
      });
    }
    return await this.prisma.scmChargeslip.findMany({
      where: data,
      include: {
        hospitalPatient: true,
        hospitalPatientType: true,
        hospitalPhysician: true,
        scmChargeslipDtls: true,
        scmReturns: true,
        scmWarehouse: true,
      },
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.scmChargeslip.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Warehouse with id ${id} does not exist`);
    }
    return data;
  }

  async update(
    id: string,
    updateChargeSlipDto: UpdateChargeSlipDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new UnauthorizedException('Unathorized');
    const data = await this.prisma.scmChargeslip.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Charge Slip with id ${id} does not exist.`);
    }
    const chargeSlip = await this.prisma.scmChargeslip.update({
      where: { id },
      data: { ...updateChargeSlipDto, updatedBy: creatorName.accountName },
    });
    return chargeSlip;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedData = this.prisma.scmChargeslip.delete({ where: { id } });
    return deletedData;
  }
}
