import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomItemLocationDecorator, CustomItemLocationDecoratorFindAll, CustomItemLocationDecoratorGet } from './decorators/item-location.decorator';
import { CreateItemLocationDto } from './dto/create-item-location.dto';
import { UpdateItemLocationDto } from './dto/update-item-location.dto';
import { ItemLocation } from './entities/item-location.entity';
import { ItemLocationService } from './item-location.service';

@Controller('item-location')
@ApiTags('scm_item_location')
export class ItemLocationController {
  constructor(private readonly itemLocationService: ItemLocationService) { }

  @Post()
  @CustomItemLocationDecorator()
  async create(@Request() request: Req, @Body() createItemLocationDto: CreateItemLocationDto) {
    const data = await this.itemLocationService.create(
      createItemLocationDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: new ItemLocation(data),
    };
  }

  @Get()
  @CustomItemLocationDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ItemLocation[]>> {
    const data = await this.itemLocationService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of all data`,
      data: data.map((res) => new ItemLocation(res)),
      total: data.length,
    };
  }

  @Get(':id')
  @CustomItemLocationDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemLocationService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ItemLocation(data),
      total: 1,
    };
  }

  @Patch(':id')
  @CustomItemLocationDecorator()
  async update(@Request() request: Req, @Param('id') id: string, @Body() updateItemLocationDto: UpdateItemLocationDto) {
    const data = await this.itemLocationService.update(
      id,
      updateItemLocationDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ItemLocation(data),
      total: 1,
    };
  }

  @Delete(':id')
  @CustomItemLocationDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemLocationService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new ItemLocation(data),
      total: 1,
    };

  }
}
