import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { ReturnEntity } from './entities/return.entity';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { WarehouseEntity } from '@api/warehouse/entities/warehouse.entity';
import { Prisma } from '@prisma/client';

@Controller('returns')
@ApiTags('scm_returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @CustomGlobalDecorator(null, false, ReturnEntity)
  async create(
    @Request() request: Req,
    @Body() createReturnDto: CreateReturnDto,
  ) {
    const data = await this.returnsService.create(
      createReturnDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: 'Return successfully created',
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(Prisma.ScmReturnScalarFieldEnum, true, ReturnEntity)
  async findAll(@Query() query: QueryT): Promise<ResponseT<ReturnEntity[]>> {
    const data = await this.returnsService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const returnData = data.map((item) => new ReturnEntity(item));
    const resData = {
      message: `List of all return fetch Successfully`,
      data: returnData,
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
  @CustomGlobalDecorator(null, false, ReturnEntity)
  async findOne(@Param('id') id: string) {
    const returnData = await this.returnsService.findOne(id);
    if (!returnData)
      throw new NotFoundException(`Return with id ${id} does not exist`);
    return {
      message: 'Fetch return Successfully',
      data: returnData,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, ReturnEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateReturnDto: UpdateReturnDto,
  ) {
    const data = await this.returnsService.update(
      id,
      updateReturnDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return data;
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, WarehouseEntity)
  async remove(@Param('id') id: string) {
    const data = this.returnsService.remove(id);
    return {
      message: `Return with id of ${id} detail deleted Successfully`,
      data: data,
    };
  }
}
