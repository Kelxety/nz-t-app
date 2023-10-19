import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception.message.replace(/\n/g, '');
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          error: 'Conflict Bad Request',
          message: [
            {
              target: {
                [exception.meta.target.toString()]: exception.name,
              },
              property: exception.meta.target,
              children: [],
              constraints: {
                isEmail: message,
              },
            },
          ],
        });
        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);

        break;
    }
  }
}
