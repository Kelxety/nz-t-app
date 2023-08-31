import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

export const CustomGlobalDecorator = (
  T: any,
  isArray: boolean,
  entity: any,
) => {
  const decorators = [];
  if (isArray) {
    decorators.push(
      ApiParam({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        schema: { type: 'integer' },
      }),
      ApiParam({
        name: 'pageSize',
        required: false,
        description: 'Number of items per page',
        schema: { type: 'integer' },
      }),
      ApiParam({
        name: 'filteredObject',
        required: false,
        description: 'JSON string representing filtered object',
        schema: {
          type: 'object',
          enum: T,
        },
      }),
      ApiParam({
        name: 'pagination',
        required: false,
        description: 'Enable/disable pagination (true/false)',
        schema: { type: 'boolean' },
      }),
      ApiParam({
        name: 'orderBy',
        required: false,
        description: 'JSON string representing sorting order',
        schema: { type: 'string' },
      }),
    );
  }
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RoleGuard),
    Roles('SUPERADMIN'),
    ApiOkResponse({ type: entity, isArray: isArray }),
    ApiUnauthorizedResponse({
      schema: {
        type: 'object',
        example: {
          message: 'string',
        },
      },
      description: '401. UnauthorizedException.',
    }),
    ...decorators,
  );
};