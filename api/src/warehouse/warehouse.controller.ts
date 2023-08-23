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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { toBoolean } from 'src/lib/helper/cast.helper';
import { WarehouseEntity } from './entities/warehouse.entity';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from 'src/lib/interface';

@Controller('warehouse')
@ApiTags('smc_warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WarehouseEntity })
  @Roles('SUPERADMIN')
  async create(
    @Request() request: Req,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    const data = await this.warehouseService.create(
      createWarehouseDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: `Warehouse successfully created`,
      data: data,
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WarehouseEntity, isArray: true })
  @Roles('SUPERADMIN')
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<WarehouseEntity[]>> {
    const data = await this.warehouseService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of all warehouse fetch Successfully`,
      data: data,
      total: data.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WarehouseEntity })
  @ApiNotFoundResponse({
    status: 404,
    description: 'NotFoundException. User was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Roles('SUPERADMIN')
  async findOne(@Param('id') id: string) {
    const data = await this.warehouseService.findOne(id);
    return {
      message: `Warehouse with id of ${id} detail fetched Succesfully`,
      data: data,
      total: 1,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WarehouseEntity })
  @Roles('SUPERADMIN')
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const data = await this.warehouseService.update(
      id,
      updateWarehouseDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Patch with id of ${id} detail patched Succesfully`,
      data: data,
      total: 1,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WarehouseEntity })
  @Roles('SUPERADMIN')
  async remove(@Param('id') id: string) {
    const data = await this.warehouseService.remove(id);
    return {
      message: `Warehouse with id of ${id} detail deleted Succesfully`,
      data: data,
      total: 1,
    };
  }
}
