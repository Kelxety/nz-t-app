import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role, User } from '@prisma/client';
import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { UsersService } from '@api/users/users.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async create(createRoleDto: CreateRoleDto, token: string) {
    const creatorName = await this.getRequesterName(token);
    return this.prisma.role.create({
      data: {
        createdBy: creatorName.accountName,
        ...createRoleDto,
        user: {},
      },
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.RoleWhereInput,
    Prisma.RoleOrderByWithAggregationInput
  >): Promise<Role[] | any> {
    if (!pagination) {
      return await this.prisma.role.findMany({
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.role.count({
        where: data,
      }),
      this.prisma.role.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} does not exist.`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, token: string) {
    const creatorName = await this.getRequesterName(token);
    const role = await this.findOne(id);
    if (!role)
      throw new NotFoundException(`Role with id ${id} does not exist.`);

    return this.prisma.role.update({
      where: { id },
      data: {
        ...updateRoleDto,
        updatedBy: creatorName.accountName,
      },
    });
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    if (!role)
      throw new NotFoundException(`Role with id ${id} does not exist.`);

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async getRequesterName(token: string): Promise<Partial<User>> {
    if (!token) throw new UnauthorizedException('Not Authorized');
    const decoded = this.jwtService.decode(token) as {
      userId: string;
      username: string;
      role: Role;
    };
    if (!decoded) {
      throw new Error();
    }
    const user = await this.usersService.findOne(decoded.userId);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
