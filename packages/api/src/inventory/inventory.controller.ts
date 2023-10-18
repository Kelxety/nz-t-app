import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { InventoryEntity } from './entities/inventory.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';

@Controller('inventory')
@ApiTags('Inventory Period')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @CustomGlobalDecorator(null, false, InventoryEntity)
  async create(
    @Request() request: Req,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    const data = await this.inventoryService.create(
      createInventoryDto, 
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Inventory successfully created`,
      data: new InventoryEntity(data),
    };
  }

  @Get()
  @CustomGlobalDecorator(null, true, InventoryEntity)
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<InventoryEntity[]>> {
    const data = await this.inventoryService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: 'List of all Item-details fetch Successfully',
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
        page: query.page,
        hasNext: Math.ceil(data[0] / query.pageSize) === query.page ? false : true,
        totalPage: Math.ceil(data[0] / query.pageSize)
      };
    }
    return resData;
  }

  @Get('search')
  @CustomGlobalDecorator(null, true , InventoryEntity)
  async fulltextSearch(
    @Query() query: QueryT,
  ): Promise<ResponseT<InventoryEntity[]>> {
    const data = await this.inventoryService.fullTextSearch({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of data`,
      data: data.map((res) => new InventoryEntity(res)),
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
  @CustomGlobalDecorator(null, false, InventoryEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.inventoryService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new InventoryEntity(data),
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, InventoryEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const data = await this.inventoryService.update(
      id,
      updateInventoryDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new InventoryEntity(data),
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, InventoryEntity)
  async remove(@Param('id') id: string) {
    const data = await this.inventoryService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new InventoryEntity(data),
    };
  }
}
