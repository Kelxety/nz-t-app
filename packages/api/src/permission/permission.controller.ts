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
  NotFoundException,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';
import { PermissionEntity } from './entities/permission.entity';
import { Request as Req } from 'express';
import { Prisma } from '@prisma/client';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

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
