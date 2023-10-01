import { UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { RoleGuard } from "../../auth/role/role.guard";
import { ReceivingEntity } from "../entities/receiving.entity";


export const CustomReceivingDecorator = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ReceivingEntity })(target, key, descriptor);
        // Roles('SUPERADMIN');
        // SetMetadata('roles', ['SUPERADMIN'])(target, key, descriptor);
    };
};

export const CustomReceivingDecoratorFindAll = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ReceivingEntity, isArray: true })(target, key, descriptor);
        // Roles('SUPERADMIN');
        // SetMetadata('roles', ['SUPERADMIN'])(target, key, descriptor);
    };
};

export const CustomReceivingDecoratorSearch = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ReceivingEntity, isArray: true })(target, key, descriptor);
        // Roles('SUPERADMIN');
        // SetMetadata('roles', ['SUPERADMIN'])(target, key, descriptor);
    };
};

export const CustomRecevingDecoratorGet = () => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        ApiBearerAuth()(target, key, descriptor);
        UseGuards(JwtAuthGuard, RoleGuard)(target, key, descriptor);
        ApiOkResponse({ type: ReceivingEntity })(target, key, descriptor);
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