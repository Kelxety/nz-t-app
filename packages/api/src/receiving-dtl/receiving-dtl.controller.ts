import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomReceivingDtlDecorator, CustomReceivingDtlDecoratorFindAll, CustomRecevingDtlDecoratorGet } from './decorators/receiving-dtl.decorator';
import { CreateReceivingDtlDto } from './dto/create-receiving-dtl.dto';
import { UpdateReceivingDtlDto } from './dto/update-receiving-dtl.dto';
import { ReceivingDtlEntity } from './entities/receiving-dtl.entity';
import { ReceivingDtlService } from './receiving-dtl.service';

@Controller('receiving-dtl')
@ApiTags('scm_receiving_dtl')
export class ReceivingDtlController {
  constructor(private readonly receivingDtlService: ReceivingDtlService) { }

  @Post()
  @CustomReceivingDtlDecorator()
  async create(
    @Request() request: Req,
    @Body() createReceivingDtlDto: CreateReceivingDtlDto) {
    const data = await this.receivingDtlService.create(
      createReceivingDtlDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: new ReceivingDtlEntity(data),
    };
  }

  @Get()
  @CustomReceivingDtlDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ReceivingDtlEntity[]>> {
    const data = await this.receivingDtlService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all data`,
      data: data.map((res: Partial<ReceivingDtlEntity>) => new ReceivingDtlEntity(res)),
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
  @CustomRecevingDtlDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.receivingDtlService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new ReceivingDtlEntity(data),
    };
  }

  @Patch(':id')
  @CustomReceivingDtlDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body()
    updateReceivingDtlDto: UpdateReceivingDtlDto) {
    const data = await this.receivingDtlService.update(
      id,
      updateReceivingDtlDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: new ReceivingDtlEntity(data),
    };
  }

  @Delete(':id')
  @CustomReceivingDtlDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.receivingDtlService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: new ReceivingDtlEntity(data),
    };
  }
}
