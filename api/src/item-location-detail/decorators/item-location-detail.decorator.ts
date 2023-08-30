import { UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { RoleGuard } from "../../auth/role/role.guard";
import { ItemLocationDetailEntity } from "../entities/item-location-detail.entity";


export const CustomItemLocationDetailDecorator = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ItemLocationDetailEntity })(target, key, descriptor);
        // Roles('SUPERADMIN');
        // SetMetadata('roles', ['SUPERADMIN'])(target, key, descriptor);
    };
};

export const CustomItemLocationDetailDecoratorFindAll = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ItemLocationDetailEntity, isArray: true })(target, key, descriptor);
        // Roles('SUPERADMIN');
        // SetMetadata('roles', ['SUPERADMIN'])(target, key, descriptor);
    };
};

export const CustomItemLocationDetailDecoratorGet = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ItemLocationDetailEntity })(target, key, descriptor);
        ApiNotFoundResponse({
            status: 404,
            description: 'NotFoundException. User was not found',
        })
        ApiUnauthorizedResponse({
            schema: {
                type: 'object',
                example: {
                    message: 'string',
                },
            },
            description: '401. UnauthorizedException.',
        })
        // Roles('SUPERADMIN')
    };
};