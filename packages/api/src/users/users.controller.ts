import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '@api/auth/guard/jwt-auth.guard';
import { RoleGuard } from '@api/auth/role/role.guard';
import { Roles } from '@api/auth/roles/roles.decorator';
import { QueryT, ResponseT } from '@api/lib/interface';
import { toBoolean } from '@api/lib/helper/cast.helper';
import { Request as Req } from 'express';
import { CustomGlobalDecorator } from '@api/lib/decorators/global.decorators';

@Controller('users')
@ApiTags('system_users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(
    @Query()
    query: QueryT,
  ): Promise<ResponseT<UserEntity[]>> {
    const users = await this.usersService.findAll({
      data: query.filteredObject ? JSON.parse(query.filteredObject) : {},
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pagination: query.pagination ? toBoolean(query.pagination) : true,
      order: query.orderBy ? JSON.parse(query.orderBy) : [],
    });
    const returnUsers = users.map((use) => new UserEntity(use));
    return {
      message: `List of all users fetch Successfully`,
      data: returnUsers,
      total: users.length,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findMe(@Request() request: Req): Promise<Partial<UserEntity>> {
    const userFind = await this.usersService.findOne(request?.user?.id);
    return new UserEntity(userFind);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'Record not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    return {
      message: `Fetch user Successfully`,
      data: new UserEntity(user),
      total: 1,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Patch('changepass/:id')
  @CustomGlobalDecorator(null, false, UserEntity)
  @ApiOkResponse({ type: UserEntity })
  async changePassword(
    @Param('id') id: string,
    @Body()
    changepass: ChangePasswordDto,
  ) {
    return new UserEntity(
      await this.usersService.changePassword(id, changepass),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
