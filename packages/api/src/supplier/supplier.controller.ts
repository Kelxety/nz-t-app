import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { toBoolean } from '../lib/helper/cast.helper';
import { QueryT, ResponseT } from '../lib/interface';
import { CustomReceivingDecoratorFindAll, CustomSupplierDecorator, CustomSupplierDecoratorGet } from './decorators/supplier.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@ApiTags('scm_supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Post()
  @CustomSupplierDecorator()
  async create(@Request() request: Req,
    @Body() createSupplierDto: CreateSupplierDto) {
    const data = await this.supplierService.create(
      createSupplierDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Successfully created`,
      data: data,
    };
  }

  @Get()
  @CustomReceivingDecoratorFindAll()
  async findAll(@Query() query: QueryT): Promise<ResponseT<SupplierEntity[]>> {
    const data = await this.supplierService.findAll({
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

  @Get(':id')
  @CustomSupplierDecoratorGet()
  async findOne(@Param('id') id: string) {
    const data = await this.supplierService.findOne(id);
    return {
      message: `${id} detail fetched Succesfully`,
      data: data,
    };
  }

  @Patch(':id')
  @CustomSupplierDecorator()
  async update(@Request() request: Req,
    @Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    const data = await this.supplierService.update(
      id,
      updateSupplierDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `${id} Data patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomSupplierDecorator()
  async remove(@Param('id') id: string) {
    const data = await this.supplierService.remove(id);
    return {
      message: `${id} Data deleted Succesfully`,
      data: data,
    };
  }
}
