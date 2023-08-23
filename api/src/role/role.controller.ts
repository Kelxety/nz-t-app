import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { QueryT, ResponseT } from 'src/lib/interface';
import { RoleEntity } from './entities/role.entity';
import { toBoolean } from 'src/lib/helper/cast.helper';

@Controller('role')
@ApiTags('system_roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  create(@Request() request: Req, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(
      createRoleDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
  }

  @Get()
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: RoleEntity, isArray: true })
  async findAll(@Query() query: QueryT): Promise<ResponseT<RoleEntity[]>> {
    const data = await this.roleService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    return {
      message: `List of all roles fetch Successfully`,
      data: data,
      total: data.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({})
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(
      id,
      updateRoleDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
