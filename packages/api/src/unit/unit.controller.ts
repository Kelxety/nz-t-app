import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guard/jwt-auth.guard';
import { RoleGuard } from '@api/auth/role/role.guard';
import { Roles } from '@api/auth/roles/roles.decorator';
import { UnitEntity } from './entities/unit.entity';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { Prisma } from '@prisma/client';
import { Request as Req } from 'express';
import { QueryT } from '@api/lib/interface';

@Controller('unit')
@ApiTags('smc_unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @ApiOkResponse({ type: UnitEntity })
  async create(@Body() createUnitDto: CreateUnitDto) {
    const data = await this.unitService.create(createUnitDto);
    return {
      message: 'Unit successfully created',
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(Prisma.ScmUnitScalarFieldEnum, true, UnitEntity)
  async findAll(
    @Query()
    query: QueryT,
  ) {
    const data = await this.unitService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: 'List of all units fetch Successfully',
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
  @CustomGlobalDecorator(null, false, UnitEntity)
  async findOne(@Param('id') id: string) {
    const data = await this.unitService.findOne(id);
    return {
      message: 'Fetch unit Successfully',
      data: data,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, UnitEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    const data = await this.unitService.update(
      id,
      updateUnitDto,
      request?.headers.authorization.split('Bearer ')[1],
    );
    return {
      message: `Unit with id of ${id} detail patched Succesfully`,
      data: data,
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(null, false, UnitEntity)
  async remove(@Param('id') id: string) {
    const removeData = await this.unitService.remove(id);
    return {
      message: `Unit with id of ${id} detail deleted Succesfully`,
      data: removeData,
    };
  }
}
