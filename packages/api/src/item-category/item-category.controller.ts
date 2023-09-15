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
  CustomItemCategoryDecorator,
  CustomItemCategoryDecoratorFindAll,
  CustomItemCategoryDecoratorGet,
} from './decorators/item-category.decorator';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { ItemCategoryEntity } from './entities/item-category.entity';
import { ItemCategoryService } from './item-category.service';

@Controller('item-category')
@ApiTags('scm_item_category')
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  @Post()
  @CustomItemCategoryDecorator()
  async create(
    @Request() request: Req,
    @Body() createItemCategoryDto: CreateItemCategoryDto,
  ) {
    const data = await this.itemCategoryService.create(
      createItemCategoryDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomItemCategoryDecoratorFindAll()
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<ItemCategoryEntity[]>> {
    const data = await this.itemCategoryService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of Data`,
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
  @CustomItemCategoryDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemCategoryService.findOne(id);
    return {
      message: `${id} fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomItemCategoryDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateItemCategoryDto: UpdateItemCategoryDto,
  ) {
    const data = await this.itemCategoryService.update(
      id,
      updateItemCategoryDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomItemCategoryDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemCategoryService.remove(id);
    return {
      message: `${id} detail deleted Succesfully`,
      data: data,
    };
  }
}
