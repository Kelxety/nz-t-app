import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { HospitalPatientService } from './hospital-patient.service';
import { CreateHospitalPatientDto } from './dto/create-hospital-patient.dto';
import { UpdateHospitalPatientDto } from './dto/update-hospital-patient.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { Prisma } from '@prisma/client';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { HospitalPatientEntity } from './entities/hospital-patient.entity';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';

@Controller('hospital-patient')
@ApiTags('hostpital-patient')
export class HospitalPatientController {
  constructor(
    private readonly hospitalPatientService: HospitalPatientService,
  ) {}

  @Post()
  @CustomGlobalDecorator(
    Prisma.HospitalPatientScalarFieldEnum,
    false,
    HospitalPatientEntity,
  )
  async create(
    @Request() request: Req,
    @Body() createHospitalPatientDto: CreateHospitalPatientDto,
  ) {
    const data = await this.hospitalPatientService.create(
      createHospitalPatientDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Patient successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.HospitalPatientScalarFieldEnum,
    true,
    HospitalPatientEntity,
  )
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<HospitalPatientEntity[]>> {
    const data = await this.hospitalPatientService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });

    const newData = data.map((entity) => {
      return new HospitalPatientEntity(entity);
    });

    return {
      message: `List of all patient fetch Successfully`,
      data: newData,
      total: data.length,
    };
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, HospitalPatientEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.hospitalPatientService.findOne(id);
    return {
      message: `Get with id of ${id} fetch Successfully`,
      data: data,
      total: 1,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, HospitalPatientEntity)
  async update(
    @Param('id') id: string,
    @Body() updateHospitalPatientDto: UpdateHospitalPatientDto,
  ) {
    const data = await this.hospitalPatientService.update(
      id,
      updateHospitalPatientDto,
    );
    return {
      message: `List of all patient fetch Successfully`,
      data: new HospitalPatientEntity(data),
      total: 1,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, HospitalPatientEntity)
  async remove(@Param('id') id: string) {
    const deleted = await this.hospitalPatientService.remove(id);
    return {
      message: 'Successfully deleted!',
      data: deleted,
      total: 1,
    };
  }
}
