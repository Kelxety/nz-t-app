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
import { ItemLocation } from '../item-location/entities/item-location.entity';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import {
  CustomItemLocationDetailDecorator,
  CustomItemLocationDetailDecoratorFindAll,
  CustomItemLocationDetailDecoratorGet,
} from './decorators/item-location-detail.decorator';
import { CreateItemLocationDetailDto } from './dto/create-item-location-detail.dto';
import { UpdateItemLocationDetailDto } from './dto/update-item-location-detail.dto';
import { ItemLocationDetailEntity } from './entities/item-location-detail.entity';
import { ItemLocationDetailService } from './item-location-detail.service';

@Controller('item-location-detail')
@ApiTags('scm_item_location_detail')
export class ItemLocationDetailController {
  constructor(
    private readonly itemLocationDetailService: ItemLocationDetailService,
  ) { }

  @Post()
  @CustomItemLocationDetailDecorator()
  async create(
    @Request() request: Req,
    @Body() createItemLocationDetailDto: CreateItemLocationDetailDto,
  ) {
    const data = await this.itemLocationDetailService.create(
      createItemLocationDetailDto,
    );
    return {
      message: `Successfully created`,
      data: new ItemLocationDetailEntity(data),
    };
  }

  @Get()
  @CustomItemLocationDetailDecoratorFindAll()
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<ItemLocationDetailEntity[]>> {
    const data = await this.itemLocationDetailService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all data`,
      data: data.map((res) => new ItemLocationDetailEntity(res)),
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
  @CustomItemLocationDetailDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.itemLocationDetailService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ItemLocationDetailEntity(data),
    };
  }

  @Patch(':id')
  @CustomItemLocationDetailDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateItemLocationDetailDto: UpdateItemLocationDetailDto,
  ) {
    const data = await this.itemLocationDetailService.update(
      id,
      updateItemLocationDetailDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ItemLocationDetailEntity(data),
    };
  }

  @Delete(':id')
  @CustomItemLocationDetailDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.itemLocationDetailService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new ItemLocation(data),
    };
  }
}
