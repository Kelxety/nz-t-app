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
  Put,
} from '@nestjs/common';
import { HospitalOfficeService } from './hospital-office.service';
import { CreateHospitalOfficeDto } from './dto/create-hospital-office.dto';
import { UpdateHospitalOfficeDto } from './dto/update-hospital-office.dto';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { HospitalOfficeEntity } from './entities/hospital-office.entity';
import { Request as Req } from 'express';
import { Prisma } from '@prisma/client';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('hospital-office')
export class HospitalOfficeController {
  constructor(private readonly hospitalOfficeService: HospitalOfficeService) {}

  @Post()
  @CustomGlobalDecorator(null, false, HospitalOfficeEntity)
  async create(
    @Request() request: Req,
    @Body() createHospitalOfficeDto: CreateHospitalOfficeDto,
  ) {
    const data = await this.hospitalOfficeService.create(
      createHospitalOfficeDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Hospital office successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.HospitalOfficeScalarFieldEnum,
    true,
    HospitalOfficeEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<HospitalOfficeEntity[]>> {
    const data = await this.hospitalOfficeService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all hospital office fetch Successfully`,
      data: data,
    };
    if (!query.pagination) {
      return resData;
    }
    if (toBoolean(query.pagination)) {
      return {
        ...resData,
        totalItems: data[0],
        data: data[1],
      };
    }
    return resData;
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, HospitalOfficeEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.hospitalOfficeService.findOne(id);
    return {
      message: `Hospital Office with id of ${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Put(':id')
  @CustomGlobalDecorator(null, false, HospitalOfficeEntity)
  async set(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateHospitalOfficeDto: UpdateHospitalOfficeDto,
  ) {
    const data = await this.hospitalOfficeService.update(
      id,
      updateHospitalOfficeDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Put with id of ${id} detail updated Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, HospitalOfficeEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateHospitalOfficeDto: UpdateHospitalOfficeDto,
  ) {
    const data = await this.hospitalOfficeService.update(
      id,
      updateHospitalOfficeDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, HospitalOfficeEntity)
  async remove(@Param('id') id: string) {
    const data = await this.hospitalOfficeService.remove(id);
    return {
      message: `Hospital office with id of ${id} detail deleted Succesfully`,
      data: data,
    };
  }
}
