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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { QueryT, ResponseT } from '@api/lib/interface';
import { RoleEntity } from './entities/role.entity';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { Prisma } from '@prisma/client';

@Controller('roles')
@ApiTags('system_roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @CustomGlobalDecorator(Prisma.RoleScalarFieldEnum, false, RoleEntity)
  create(@Request() request: Req, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(
      createRoleDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
  }

  @Get()
  @CustomGlobalDecorator(Prisma.RoleScalarFieldEnum, true, RoleEntity)
  async findAll(@Query() query: QueryT): Promise<ResponseT<RoleEntity[]>> {
    const data = await this.roleService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: `List of all roles fetch Successfully`,
      data: data,
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
  @CustomGlobalDecorator(Prisma.RoleScalarFieldEnum, false, RoleEntity)
  async findOne(@Param('id') id: string) {
    const user = await this.roleService.findOne(id);
    return {
      message: `Role successfuly fetch`,
      data: new RoleEntity(user),
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(Prisma.RoleScalarFieldEnum, false, RoleEntity)
  async update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const roleUpdated = await this.roleService.update(
      id,
      updateRoleDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: 'Role successfully updated',
      data: new RoleEntity(roleUpdated),
    };
  }

  @Delete(':id')
  @CustomGlobalDecorator(Prisma.RoleScalarFieldEnum, false, RoleEntity)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
    return {
      message: 'Role successfully deleted',
      data: {},
    };
  }
}
