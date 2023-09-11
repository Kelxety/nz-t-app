import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { QueryT, ResponseT } from '@api/lib/interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ChargeSlipDetailsService } from './charge-slip-details.service';
import { CreateChargeSlipDetailDto } from './dto/create-charge-slip-detail.dto';
import { UpdateChargeSlipDetailDto } from './dto/update-charge-slip-detail.dto';
import { ChargeSlipDetailEntity } from './entities/charge-slip-detail.entity';

@Controller('charge-slip-details')
@ApiTags('scm_charge_slip_details')
export class ChargeSlipDetailsController {
  constructor(
    private readonly chargeSlipDetailsService: ChargeSlipDetailsService,
  ) {}

  @Post()
  @CustomGlobalDecorator(null, false, ChargeSlipDetailEntity)
  create(@Body() createChargeSlipDetailDto: CreateChargeSlipDetailDto) {
    const data = this.chargeSlipDetailsService.create(
      createChargeSlipDetailDto,
    );
    return {
      message: 'Chargeslip detail successfully created',
      data: data,
      total: 1,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.ScmChargeslipDtlScalarFieldEnum,
    true,
    ChargeSlipDetailEntity,
  )
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<ChargeSlipDetailEntity[]>> {
    const data = await this.chargeSlipDetailsService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const newData = data.map((get) => {
      return new ChargeSlipDetailEntity(get);
    });
    return {
      message: 'List of all chargeslip fetch Successfully',
      data: newData,
      total: newData.length,
    };
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, ChargeSlipDetailEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.chargeSlipDetailsService.findOne(id);
    return {
      message: `Get with id of ${id} fetch Successfully`,
      data: data,
      total: 1,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, ChargeSlipDetailEntity)
  async update(
    @Param('id') id: string,
    @Body() updateChargeSlipDetailDto: UpdateChargeSlipDetailDto,
  ) {
    const data = await this.chargeSlipDetailsService.update(
      id,
      updateChargeSlipDetailDto,
    );
    return {
      message: 'Chargeslip detail updated successfully',
      data: new ChargeSlipDetailEntity(data),
      total: 1,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chargeSlipDetailsService.remove(+id);
  }
}
