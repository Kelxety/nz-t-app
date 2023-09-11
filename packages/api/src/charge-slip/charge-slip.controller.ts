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
import { ChargeSlipService } from './charge-slip.service';
import { Request as Req } from 'express';
import { CreateChargeSlipDto } from './dto/create-charge-slip.dto';
import { UpdateChargeSlipDto } from './dto/update-charge-slip.dto';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { ChargeSlipEntity } from './entities/charge-slip.entity';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('charge-slip')
@ApiTags('scm_charge_slip')
export class ChargeSlipController {
  constructor(private readonly chargeSlipService: ChargeSlipService) {}

  @Post()
  @CustomGlobalDecorator(null, false, ChargeSlipEntity)
  async create(
    @Request() request: Req,
    @Body() createChargeSlipDto: CreateChargeSlipDto,
  ) {
    const data = await this.chargeSlipService.create(
      createChargeSlipDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: 'Charge Slip successfully created',
      data: data,
      total: 1,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmChargeslipScalarFieldEnum,
    true,
    ChargeSlipEntity,
  )
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<ChargeSlipEntity[]>> {
    const data = await this.chargeSlipService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const returnData = data.map((chrgSlip) => new ChargeSlipEntity(chrgSlip));
    return {
      message: `List of all Charge Slip fetch Successfully`,
      data: returnData,
      total: data.length,
    };
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, ChargeSlipEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.chargeSlipService.findOne(id);
    return {
      message: 'Fetch chargeslip Successfully',
      data: data,
      total: 1,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, ChargeSlipEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateChargeSlipDto: UpdateChargeSlipDto,
  ) {
    const data = await this.chargeSlipService.update(
      id,
      updateChargeSlipDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Charge Slip with id of ${id} detail patched Succesfully`,
      data: data,
      total: 1,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, ChargeSlipEntity)
  remove(@Param('id') id: string) {
    const removeData = this.chargeSlipService.remove(id);
    return {
      message: `Charge Slip with id of ${id} detail deleted Successfully`,
      data: removeData,
      total: 1,
    };
  }
}
