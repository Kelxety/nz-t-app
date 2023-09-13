import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginateOptions } from '@api/lib/interface';
import { Prisma, User } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: { username: createUserDto.username },
    });
    console.log('conflict', user);
    if (!user) {
      throw new ConflictException(
        `User with username of ${createUserDto.username}`,
      );
    }
    const password = await bcrypt.hash(createUserDto.password, roundsOfHashing);
    createUserDto.password = password;
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        role: {},
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
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithAggregationInput
  >): Promise<User[]> {
    if (!pagination) {
      return this.prisma.user.findMany({
        include: {
          refresh_token: true,
          role: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const users = await this.prisma.user.findMany({
      where: data,
      take: pageSize || 10,
      skip: (page - 1) * pageSize || 0,
      orderBy: order,
      include: {
        refresh_token: true,
        role: true,
      },
    });

    return users;
  }

  async findOne(id: string) {
    const data = await this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: { id },
    });
    if (!data) throw new NotFoundException('User not Found!');
    return data;
  }

  findByUsername(username: string) {
    const data = this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: {
        username: username,
      },
    });
    if (!data) throw new NotFoundException('User not Found!');
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    const isPasswordValid = await bcrypt.compare(
      updateUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect!');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.password,
        ...updateUserDto,
        role: {
          create: updateUserDto.role,
        },
      },
    });
  }

  async changePassword(id: string, updatePassword: ChangePasswordDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    const isPasswordValid = await bcrypt.compare(
      updatePassword.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect!');
    }

    if (updatePassword.newPassword) {
      updatePassword.newPassword = await bcrypt.hash(
        updatePassword.newPassword,
        roundsOfHashing,
      );
    }
    console.log(updatePassword.newPassword);
    return this.prisma.user.update({
      where: { id },
      data: {
        password: updatePassword.newPassword,
      },
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user)
      throw new NotFoundException(`User with id ${id} does not exist.`);

    const data = await this.prisma.user.delete({ where: { id } });
    return data;
  }

  async findLength(): Promise<number> {
    return await this.prisma.user.count();
  }
}
