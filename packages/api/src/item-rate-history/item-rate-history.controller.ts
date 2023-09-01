import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomDecorator, CustomDecoratorFindAll, CustomDecoratorGet } from './decorators/item-rate-history.decorators';
import { CreateItemRateHistoryDto } from './dto/create-item-rate-history.dto';
import { ItemRateHistoryEntity } from './entities/item-rate-history.entity';
import { ItemRateHistoryService } from './item-rate-history.service';

@Controller('item-rate-history')
@ApiTags('scm_item_rate_history')
export class ItemRateHistoryController {
  constructor(private readonly itemRateHistoryService: ItemRateHistoryService) { }

  @Post()
  @CustomDecorator()
  async create(@Request() request: Req, @Body() createItemRateHistoryDto: CreateItemRateHistoryDto) {
    const data = await this.itemRateHistoryService.create(
      createItemRateHistoryDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: new ItemRateHistoryEntity(data),
    };
  }

  @Get()
  @CustomDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ItemRateHistoryEntity[]>> {
    const data = await this.itemRateHistoryService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of Data`,
      data: data.map((res) => new ItemRateHistoryEntity(res)),
      total: data.length,
    };
  }

  @Get(':id')
  @CustomDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemRateHistoryService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ItemRateHistoryEntity(data),
      total: 1,
    };
  }

  // @Patch(':id')
  // @CustomDecorator()
  // async update(@Request() request: Req, @Param('id') id: string, @Body() updateItemRateHistoryDto: UpdateItemRateHistoryDto) {
  //   const data = await this.itemRateHistoryService.update(
  //     id,
  //     updateItemRateHistoryDto,
  //     request?.headers?.authorization?.split('Bearer ')[1],
  //   );
  //   return {
  //     message: `Patch with id of ${id} detail patched Succesfully`,
  //     data: new ItemRateHistoryEntity(data),
  //     total: 1,
  //   };
  // }

  // @Delete(':id')
  // @CustomDecorator()
  // async remove(@Param('id') id: string) {
  //   const data = await this.itemRateHistoryService.remove(id);
  //   return {
  //     message: `Warehouse with id of ${id} detail deleted Succesfully`,
  //     data: new ItemRateHistoryEntity(data),
  //     total: 1,
  //   };
  // }

}
