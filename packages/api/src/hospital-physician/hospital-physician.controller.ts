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
import { HospitalPhysicianService } from './hospital-physician.service';
import { CreateHospitalPhysicianDto } from './dto/create-hospital-physician.dto';
import { UpdateHospitalPhysicianDto } from './dto/update-hospital-physician.dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { HospitalPhysicianEntity } from './entities/hospital-physician.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { Prisma } from '@prisma/client';

@Controller('hospital-physician')
@ApiTags('hospital_physician')
export class HospitalPhysicianController {
  constructor(
    private readonly hospitalPhysicianService: HospitalPhysicianService,
  ) {}

  @Post()
  @CustomGlobalDecorator(null, false, HospitalPhysicianEntity)
  create(
    @Request() request: Req,
    @Body() createHospitalPhysicianDto: CreateHospitalPhysicianDto,
  ) {
    const data = this.hospitalPhysicianService.create(
      createHospitalPhysicianDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: 'Physician successfully created',
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.HospitalPhysicianScalarFieldEnum,
    true,
    HospitalPhysicianEntity,
  )
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<HospitalPhysicianEntity[]>> {
    const data = await this.hospitalPhysicianService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: 'List of all physician fetch Successfully',
      data: data,
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
  @CustomGlobalDecorator(null, false, HospitalPhysicianEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.hospitalPhysicianService.findOne(id);
    return {
      message: 'Fetch physician Successfully',
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, HospitalPhysicianEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateHospitalPhysicianDto: UpdateHospitalPhysicianDto,
  ) {
    const data = await this.hospitalPhysicianService.update(
      id,
      updateHospitalPhysicianDto,
      request?.headers.authorization.split('Bearer ')[1],
    );
    return {
      message: `Physician with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removeData = this.hospitalPhysicianService.remove(id);
    return {
      message: `Physician with id of ${id} detail deleted Succesfully`,
      data: removeData,
    };
  }
}
