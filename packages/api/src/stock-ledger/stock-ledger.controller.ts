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
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request as Req } from 'express';
import { CustomGlobalDecorator } from '../lib/decorators/global.decorators';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CreateStockLedgerDto } from './dto/create-stock-ledger.dto';
import { UpdateStockLedgerDto } from './dto/update-stock-ledger.dto';
import { StockLedgerEntity } from './entities/stock-ledger.entity';
import { StockLedgerService } from './stock-ledger.service';

@ApiTags('scm_stock_ledger')
@Controller('stock-ledger')
export class StockLedgerController {
  constructor(private readonly stockLedgerService: StockLedgerService) { }

  @Post()
  @CustomGlobalDecorator(null, false, StockLedgerEntity)
  async create(
    @Request() request: Req,
    @Body() createStockLedgerDto: CreateStockLedgerDto) {
    const data = await this.stockLedgerService.create(
      createStockLedgerDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `successfully created`,
      data: new StockLedgerEntity(data),
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmStockLedgerScalarFieldEnum,
    true,
    StockLedgerEntity,
  )
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<StockLedgerEntity[]>> {
    const data = await this.stockLedgerService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `fetch Successfully`,
      data: data.map((res: Partial<StockLedgerEntity>) => new StockLedgerEntity(res)),
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
  @CustomGlobalDecorator(null, false, StockLedgerEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.stockLedgerService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: new StockLedgerEntity(data),
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, StockLedgerEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body() updateStockLedgerDto: UpdateStockLedgerDto) {
    const data = await this.stockLedgerService.update(
      id,
      updateStockLedgerDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: new StockLedgerEntity(data),
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, StockLedgerEntity)
  async remove(@Param('id') id: string) {
    const data = await this.stockLedgerService.remove(id);
    return {
      message: `${id} detail deleted Succesfully`,
      data: new StockLedgerEntity(data),
    };
  }
}
