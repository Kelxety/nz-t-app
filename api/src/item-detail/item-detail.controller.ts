import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomItemDetailDecorator, CustomItemDetailDecoratorFindAll, CustomItemDetailDecoratorGet } from './decorators/item-detail.decorator';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';
import { ItemDetailEntity } from './entities/item-detail.entity';
import { ItemDetailService } from './item-detail.service';

@Controller('item-detail')
@ApiTags('scm_item_detail')
export class ItemDetailController {
  constructor(private readonly itemDetailService: ItemDetailService) { }

  @Post()
  @CustomItemDetailDecorator()
  async create(@Request() request: Req, @Body() createItemDetailDto: CreateItemDetailDto) {
    const data = await this.itemDetailService.create(
      createItemDetailDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: new ItemDetailEntity(data),
    };
  }

  @Get()
  @CustomItemDetailDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ItemDetailEntity[]>> {
    const data = await this.itemDetailService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of data`,
      data: data.map((res) => new ItemDetailEntity(res)),
      total: data.length,
    };
  }

  @Get(':id')
  @CustomItemDetailDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemDetailService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ItemDetailEntity(data),
      total: 1,
    };
  }

  @Patch(':id')
  @CustomItemDetailDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body() updateItemDetailDto: UpdateItemDetailDto) {
    const data = await this.itemDetailService.update(
      id,
      updateItemDetailDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ItemDetailEntity(data),
      total: 1,
    };
  }

  @Delete(':id')
  @CustomItemDetailDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemDetailService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new ItemDetailEntity(data),
      total: 1,
    };
  }
}
