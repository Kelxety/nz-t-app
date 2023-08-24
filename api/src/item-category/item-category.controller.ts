import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomItemCategoryDecorator, CustomItemCategoryDecoratorFindAll, CustomItemCategoryDecoratorGet } from './decorators/item-category.decorator';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { ItemCategoryEntity } from './entities/item-category.entity';
import { ItemCategoryService } from './item-category.service';

@Controller('item-category')
@ApiTags('smc_item_category')
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) { }

  @Post()
  @CustomItemCategoryDecorator()
  async create(@Request() request: Req, @Body() createItemCategoryDto: CreateItemCategoryDto) {
    const data = await this.itemCategoryService.create(
      createItemCategoryDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Warehouse successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomItemCategoryDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ItemCategoryEntity[]>> {
    const data = await this.itemCategoryService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of all warehouse fetch Successfully`,
      data: data,
      total: data.length,
    };
  }

  @Get(':id')
  @CustomItemCategoryDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemCategoryService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: data,
      total: 1,
    };
  }

  @Patch(':id')
  @CustomItemCategoryDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body() updateItemCategoryDto: UpdateItemCategoryDto) {
    const data = await this.itemCategoryService.update(
      id,
      updateItemCategoryDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
      total: 1,
    };
  }

  @Delete(':id')
  @CustomItemCategoryDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemCategoryService.remove(id);
    return {
      message: `Warehouse with id of ${id} detail deleted Succesfully`,
      data: data,
      total: 1,
    };
  }
}
