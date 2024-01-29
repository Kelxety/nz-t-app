import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { QueryT, ResponseT } from '@api/lib/interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request as Req } from 'express';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './permission.service';

@Controller('permissions')
@ApiTags('system_permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  @CustomGlobalDecorator(null, false, PermissionEntity)
  async create(
    @Request() request: Req,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    const data = await this.permissionService.create(
      createPermissionDto,
      request?.headers?.authorization.split('Bearer ')[1],
    );
    return {
      message: 'Permission successfully created',
      data: data,
    };
  }

  @Get()
  @CustomGlobalDecorator(
    Prisma.PermissionScalarFieldEnum,
    true,
    PermissionEntity,
  )
  async findAll(
    @Query() query: QueryT,
  ): Promise<ResponseT<PermissionEntity[]>> {
    const data = await this.permissionService.findAll({
      searchData: query.q,
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const resData = {
      message: 'List of all permissions fetch Successfully',
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

  @Patch('/users/:id')
  @CustomGlobalDecorator(null, false, PermissionEntity)
  async findByUserId(@Param('id') id: string, @Body() ids: string[]) {
    const returnData = await this.permissionService.patchIdByUser(id, ids);
    if (!returnData)
      throw new NotFoundException(`Permission with id ${id} does not exist`);
    return {
      message: `Fetch permission Successfully`,
      data: returnData,
    };
  }

  @Get(':id')
  @CustomGlobalDecorator(null, false, PermissionEntity)
  async findOne(@Param('id') id: string) {
    const returnData = await this.permissionService.findOne(id);
    if (!returnData)
      throw new NotFoundException(`Permission with id ${id} does not exist`);
    return {
      message: `Fetch permission Successfully`,
      data: returnData,
    };
  }

  @Patch(':id')
  @CustomGlobalDecorator(null, false, PermissionEntity)
  update(
    @Request() request: Req,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const data = this.permissionService.update(
      id,
      updatePermissionDto,
      request?.headers?.authorization?.split('Bearer ')[1],
    );
    return {
      message: `Successfully updated`,
      data: data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const data = this.permissionService.remove(id);
    return {
      message: `Return with id of ${id} detail deleted Successfully`,
      data: data,
    };
  }
}
