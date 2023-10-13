import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { IssuanceService } from './issuance.service';
import { CreateIssuanceDto } from './dto/create-issuance.dto';
import { UpdateIssuanceDto } from './dto/update-issuance.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { IssuanceEntity } from './entities/issuance.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { Prisma } from '@prisma/client';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';

@Controller('issuance')
@ApiTags('Issuance Header')
export class IssuanceController {
  constructor(private readonly issuanceService: IssuanceService) {}

  @Post()
  @CustomGlobalDecorator(null, false, IssuanceEntity)
  
  async create(
    @Request() request: Req,
    @Body() createIssuanceDto: CreateIssuanceDto,
  ) {
    const data = await this.issuanceService.create(
      createIssuanceDto, 
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Warehouse successfully created`,
      data: new IssuanceEntity(data),
    };
  }

  @Get()
  @CustomGlobalDecorator (
    Prisma.ScmIssuanceScalarFieldEnum,
    true,
    IssuanceEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<IssuanceEntity[]>> {
    const data = await this.issuanceService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all issuance fetch Successfully`,
      data: data.map(d => new IssuanceEntity(d)),
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

  @Get('search')
  @CustomGlobalDecorator (
    Prisma.ScmIssuanceScalarFieldEnum,
    true,
    IssuanceEntity,
  )
  async fulltextSearch(@Query() query: QueryT): Promise<ResponseT<IssuanceEntity[]>> {
    const data = await this.issuanceService.fulltextSearch({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all Item fetch Successfully`,
      data: data.map((res) => new IssuanceEntity(res)),
    };
    if (!query.pagination) {
      return {
        ...resData,
        totalItems: data[0],
        data: data[1],
      };
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
  @CustomGlobalDecorator(null, false, IssuanceEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.issuanceService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: new IssuanceEntity(data),
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, IssuanceEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateIssuanceDto,
  ) {
    const data = await this.issuanceService.update(
      id,
      updateWarehouseDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: new IssuanceEntity(data),
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, IssuanceEntity)
  async remove(@Param('id') id: string) {
    const data = await this.issuanceService.remove(id);
    return {
      message: `Warehouse with id of ${id} detail deleted Succesfully`,
      data: new IssuanceEntity(data),
    };
  }
}
