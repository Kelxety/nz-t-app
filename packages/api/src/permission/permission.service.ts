import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService, private role: RoleService) { }
  async create(createPermissionDto: CreatePermissionDto, token: string) {
    const creatorName = await this.role.getRequesterName(token);
    if (!creatorName) throw new Error('Unathorized');
    return await this.prisma.permission.create({
      data: { ...createPermissionDto, createdBy: creatorName.accountName },
    });
  }

  async findAll({
    searchData,
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.PermissionWhereInput,
    Prisma.PermissionOrderByWithAggregationInput
  >): Promise<Permission[] | any> {
    if (!pagination) {
      return this.prisma.permission.findMany({
        where: {
          OR: [
            {
              menuName: {
                contains: searchData,
              },
            },
          ],
          AND: data,
        },
        include: {
          role: {
            include: {
              role: true,
            },
          },
        },
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.permission.count({
        where: {
          OR: [
            {
              menuName: {
                contains: searchData,
              },
            },
          ],
          AND: data,
        },
      }),
      this.prisma.permission.findMany({
        where: {
          OR: [
            {
              menuName: {
                contains: searchData,
              },
            },
          ],
          AND: data,
        },
        include: {
          role: {
            include: {
              role: true,
            },
          },
        },
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.permission.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!data)
      throw new NotFoundException(`Permission with id ${id} not found!`);
    return data;
  }

  async patchIdByUser(id: string, data: string[]) {
    // await this.role.findOne(id);
    const newData = await this.prisma.role.update({
      where: {
        id: id,
      },
      data: {
        permission: {
          deleteMany: {},
          create: data.map((t: string) => ({
            permission: { connect: { id: t } },
            assignedBy: 'SUPERADMIN',
          })),
        },
      },
    });
    // const data = await this.prisma.permission.updateMany({
    //   where: {
    //     id: data
    //   }
    // });
    if (!data) throw new NotFoundException(`Menu with id ${id} not found!`);

    return data;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    token: string,
  ) {
    const creatorName = await this.role.getRequesterName(token);
    await this.findOne(id);
    const data = await this.prisma.permission.update({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
      data: {
        ...updatePermissionDto,
        updatedBy: creatorName.accountName,
      },
    });
    return data;
  }

  async remove(id: string) {
    const newDelete = await this.findOne(id);
    const findEno = await this.prisma.permissionOnRoles.delete({
      where: {
        roleId_permissionId: {
          permissionId: id,
          roleId: newDelete.role[0].roleId,
        },
      },
    });
    // const permissionDelete = this.prisma.permissionOnRoles.

    const deletedData = this.prisma.permission.delete({
      where: {
        id,
      },
    });
    return deletedData;
  }
}
