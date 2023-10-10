import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
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
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CreateStockLedgerCodeDto } from './dto/create-stock-ledger-code.dto';
import { UpdateStockLedgerCodeDto } from './dto/update-stock-ledger-code.dto';
import { StockLedgerCodeEntity } from './entities/stock-ledger-code.entity';
import { StockLedgerCodeService } from './stock-ledger-code.service';

@Controller('stock-ledger-code')
@ApiTags('scm_ledger_code')
export class StockLedgerCodeController {
  constructor(private readonly stockLedgerCodeService: StockLedgerCodeService) { }

  @Post()
  @CustomGlobalDecorator(null, false, StockLedgerCodeEntity)
  async create(
    @Request() request: Req,
    @Body() createStockLedgerCodeDto: CreateStockLedgerCodeDto) {
    const data = await this.stockLedgerCodeService.create(
      createStockLedgerCodeDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Warehouse successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmLedgerCodeScalarFieldEnum,
    true,
    StockLedgerCodeEntity,
  )
  async findAll(@Query()
  query: QueryT,): Promise<ResponseT<StockLedgerCodeEntity[]>> {
    const data = await this.stockLedgerCodeService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `fetch Successfully`,
      data: data,
    };
    if (!query.pagination) {
      return resData;
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
  @CustomGlobalDecorator(null, false, StockLedgerCodeEntity)
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. Data was not found',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.stockLedgerCodeService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, StockLedgerCodeEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string, @Body() updateStockLedgerCodeDto: UpdateStockLedgerCodeDto) {
    const data = await this.stockLedgerCodeService.update(
      id,
      updateStockLedgerCodeDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, StockLedgerCodeEntity)
  async remove(@Param('id') id: string) {
    const data = await this.stockLedgerCodeService.remove(id);
    return {
      message: ` ${id} detail deleted Succesfully`,
      data: data,
    };
  }
}
