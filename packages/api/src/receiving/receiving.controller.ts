import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomReceivingDecorator, CustomReceivingDecoratorFindAll, CustomReceivingDecoratorSearch, CustomRecevingDecoratorGet } from './decorators/receiving.decorator';
import { CreateReceivingDto } from './dto/create-receiving.dto';
import { UpdateReceivingDto } from './dto/update-receiving.dto';
import { ReceivingEntity } from './entities/receiving.entity';
import { ReceivingService } from './receiving.service';

@Controller('receiving')
@ApiTags('scm_receive')
export class ReceivingController {
  constructor(private readonly receivingService: ReceivingService) { }

  @Post()
  @CustomReceivingDecorator()
  async create (
    @Request() request: Req,
    @Body() createReceivingDto: CreateReceivingDto) {
    const data = await this.receivingService.create(
      createReceivingDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: new ReceivingEntity(data),
    };
  }

  @Get()
  @CustomReceivingDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ReceivingEntity[]>> {
    const data = await this.receivingService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all data`,
      data: data.map((res: Partial<ReceivingEntity>) => new ReceivingEntity(res)),
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
  @CustomReceivingDecoratorSearch()
  async search(@Query() query: QueryT): Promise<ResponseT<ReceivingEntity[]>> {
    const data = await this.receivingService.searchFilterFulltext({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all data`,
      data: data.map((res: Partial<ReceivingEntity>) => new ReceivingEntity(res)),
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
  @CustomRecevingDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.receivingService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ReceivingEntity(data),
    };
  }

  @Patch(':id')
  @CustomReceivingDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateReceivingDto: UpdateReceivingDto) {
    const data = await this.receivingService.update(
      id,
      updateReceivingDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ReceivingEntity(data),
    };
  }

  @Patch('posting/:id')
  @CustomReceivingDecorator()
  async updatePosting(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateReceivingDto: UpdateReceivingDto) {
    const data = await this.receivingService.updatePosting(
      id,
      updateReceivingDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ReceivingEntity(data),
    };
  }

  @Delete(':id')
  @CustomReceivingDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.receivingService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new ReceivingEntity(data),
    };
  }
}
