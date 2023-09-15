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
import { HospitalPatientTypeService } from './hospital-patient-type.service';
import { CreateHospitalPatientTypeDto } from './dto/create-hospital-patient-type.dto';
import { UpdateHospitalPatientTypeDto } from './dto/update-hospital-patient-type.dto';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { HospitalPatientTypeEntity } from './entities/hospital-patient-type.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('hospital-patient-type')
@ApiTags('hospital_patient-type')
export class HospitalPatientTypeController {
  constructor(
    private readonly hospitalPatientTypeService: HospitalPatientTypeService,
  ) {}

  @Post()
  @CustomGlobalDecorator(null, false, HospitalPatientTypeEntity)
  async create(
    @Request() request: Req,
    @Body() createHospitalPatientTypeDto: CreateHospitalPatientTypeDto,
  ) {
    const data = await this.hospitalPatientTypeService.create(
      createHospitalPatientTypeDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Hospital Patient Type successfully created!`,
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.HospitalPatientTypeScalarFieldEnum,
    true,
    HospitalPatientTypeEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<HospitalPatientTypeEntity[]>> {
    const data = await this.hospitalPatientTypeService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const newData = data.map((entity) => new HospitalPatientTypeEntity(entity));
    const resData = {
      message: `List of all hospital patient type fetch Successfully`,
      data: newData,
    };
    if (!query.pagination) {
      return resData;
    }
    if (toBoolean(query.pagination)) {
      return {
        ...resData,
        data: data[1],
      };
    }
    return resData;
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, HospitalPatientTypeEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.hospitalPatientTypeService.findOne(id);
    return {
      message: `Hospital Patient Type with the id of ${id} fetch Successfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, HospitalPatientTypeEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateHospitalPatientTypeDto: UpdateHospitalPatientTypeDto,
  ) {
    const data = await this.hospitalPatientTypeService.update(
      id,
      updateHospitalPatientTypeDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Hospital Patient Type with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.hospitalPatientTypeService.remove(id);
    return {
      message: `Hospital Patient Type with id of ${id} detail deleted Succesfully`,
      data: data,
    };
  }
}
