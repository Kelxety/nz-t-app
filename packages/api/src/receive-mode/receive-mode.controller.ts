import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request as Req } from 'express';
import { CustomGlobalDecorator } from '../lib/decorators/global.decorators';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomReceivingModeDecorator, CustomReceivingModeDecoratorFindAll, CustomRecevingModeDecoratorGet } from './decorators/receive-mode.decorator';
import { CreateReceiveModeDto } from './dto/create-receive-mode.dto';
import { UpdateReceiveModeDto } from './dto/update-receive-mode.dto';
import { ReceiveMode } from './entities/receive-mode.entity';
import { ReceiveModeService } from './receive-mode.service';

@Controller('receive-mode')
@ApiTags('scm_receive_mode')
export class ReceiveModeController {
  constructor(private readonly receiveModeService: ReceiveModeService) { }

  @Post()
  @CustomReceivingModeDecorator()
  async create(
    @Request() request: Req,
    @Body() createReceiveModeDto: CreateReceiveModeDto) {
    const data = await this.receiveModeService.create(
      createReceiveModeDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomReceivingModeDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<ReceiveMode[]>> {
    const data = await this.receiveModeService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all data`,
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

  @Get('search')
  @CustomGlobalDecorator(Prisma.ScmReceiveModeScalarFieldEnum, true, ReceiveMode)
  async fulltextSearch(
    @Query() query: QueryT,
  ): Promise<ResponseT<ReceiveMode[]>> {
    const data = await this.receiveModeService.fullTextSearch({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of data`,
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
      };
    }
    return resData;
  }

  @Get(':id')
  @CustomRecevingModeDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.receiveModeService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomReceivingModeDecorator()
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body() updateReceiveModeDto: UpdateReceiveModeDto) {
    const data = await this.receiveModeService.update(
      id,
      updateReceiveModeDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomReceivingModeDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.receiveModeService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: data,
    };
  }
}
