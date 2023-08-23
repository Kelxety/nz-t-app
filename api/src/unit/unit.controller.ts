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
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UnitEntity } from './entities/unit.entity';
import { toBoolean } from 'src/lib/helper/cast.helper';

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UnitEntity, isArray: true })
  @Roles('SUPERADMIN')
  async findAll(
    @Query()
    query: {
      filteredObject?: string;
      page?: number;
      pageSize?: number;
      pagination?: string;
      orderBy?: string;
    },
  ): Promise<{ message: string; data: UnitEntity[]; total: number }> {
    const data = await this.unitService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: 'List of all units fetch Successfully',
      data: data,
      total: data.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UnitEntity })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UnitEntity })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UnitEntity })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
