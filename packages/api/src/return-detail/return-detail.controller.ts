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
} from '@nestjs/common';
import { ReturnDetailService } from './return-detail.service';
import { CreateReturnDetailDto } from './dto/create-return-detail.dto';
import { UpdateReturnDetailDto } from './dto/update-return-detail.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { ReturnDetailEntity } from './entities/return-detail.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { Prisma } from '@prisma/client';

@Controller('return-detail')
@ApiTags('scm_return_detail')
export class ReturnDetailController {
  constructor(private readonly returnDetailService: ReturnDetailService) {}

  @Post()
  @CustomGlobalDecorator(null, false, ReturnDetailEntity)
  async create(
    @Request() request: Req,
    @Body() createReturnDetailDto: CreateReturnDetailDto,
  ) {
    const data = await this.returnDetailService.create(
      createReturnDetailDto,
      request?.headers?.authorization.split('Bearer')[1],
    );

    return {
      message: 'Return Detail successfully created',
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmReturnDtlScalarFieldEnum,
    true,
    ReturnDetailEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<ReturnDetailEntity[]>> {
    const data = await this.returnDetailService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: 'list',
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
  @CustomGlobalDecorator(null, false, ReturnDetailEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.returnDetailService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, ReturnDetailEntity)
  async update(
    @Param('id') id: string,
    @Body() updateReturnDetailDto: UpdateReturnDetailDto,
  ) {
    const data = await this.returnDetailService.update(
      id,
      updateReturnDetailDto,
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, ReturnDetailEntity)
  async remove(@Param('id') id: string) {
    const data = await this.returnDetailService.remove(id);

    return {
      message: 'Deleted Successfuly',
      data: data,
    };
  }
}
