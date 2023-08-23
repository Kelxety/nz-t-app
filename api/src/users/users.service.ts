import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, roundsOfHashing);
    createUserDto.password = password;
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        role: {},
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: { id: id },
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: {
        username: username,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
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
        ...updateUserDto,
        role: {
          create: updateUserDto.role,
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findLength(): Promise<number> {
    return await this.prisma.user.count();
  }
}
