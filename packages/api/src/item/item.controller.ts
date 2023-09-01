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
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import {
  CustomItemDecorator,
  CustomItemDecoratorFindAll,
  CustomItemDecoratorGet,
} from './decorators/item.decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';

@Controller('item')
@ApiTags('scm_item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @CustomItemDecorator()
  async create(@Request() request: Req, @Body() createItemDto: CreateItemDto) {
    const data = await this.itemService.create(
      createItemDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Item successfully created`,
      data: new ItemEntity(data),
    };
  }

  @Get()
  @CustomItemDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ItemEntity[]>> {
    const data = await this.itemService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of all Item fetch Successfully`,
      data: data.map((res) => new ItemEntity(res)),
      total: data.length,
    };
  }

  @Get(':id')
  @CustomItemDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemService.findOne(id);
    return {
      message: `Item with id of ${id} detail fetched Succesfully`,
      data: new ItemEntity(data),
      total: 1,
    };
  }

  @Patch(':id')
  @CustomItemDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const data = await this.itemService.update(
      id,
      updateItemDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: new ItemEntity(data),
      total: 1,
    };
  }

  @Delete(':id')
  @CustomItemDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemService.remove(id);
    return {
      message: `Item with id of ${id} detail deleted Succesfully`,
      data: data,
      total: 1,
    };
  }
}
