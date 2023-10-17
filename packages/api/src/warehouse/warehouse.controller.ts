import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { QueryT, ResponseT } from '@api/lib/interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request as Req } from 'express';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseEntity } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
@ApiTags('smc_warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @Post()
  @CustomGlobalDecorator(null, false, WarehouseEntity)
  async create(
    @Request() request: Req,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    const data = await this.warehouseService.create(
      createWarehouseDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Warehouse successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmWarehouseScalarFieldEnum,
    true,
    WarehouseEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<WarehouseEntity[]>> {
    const data = await this.warehouseService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all Warehouse fetch Successfully`,
      data: data.map(
        (warehouse: WarehouseEntity) => new WarehouseEntity(warehouse),
      ),
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

  @Get('search')
  @CustomGlobalDecorator(Prisma.ScmUnitScalarFieldEnum, true, WarehouseEntity)
  async fulltextSearch(
    @Query() query: QueryT,
  ): Promise<ResponseT<WarehouseEntity[]>> {
    const data = await this.warehouseService.fullTextSearch({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of data`,
      data: data,
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
  @CustomGlobalDecorator(null, false, WarehouseEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.warehouseService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, WarehouseEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const data = await this.warehouseService.update(
      id,
      updateWarehouseDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Warehouse with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, WarehouseEntity)
  async remove(@Param('id') id: string) {
    const data = await this.warehouseService.remove(id);
    return {
      message: `Warehouse with id of ${id} detail deleted Succesfully`,
      data: data,
    };
  }
}
