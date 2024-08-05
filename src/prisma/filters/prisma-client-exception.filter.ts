import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

enum PrismaErrorMessages {
  P2000 = "The provided value for the column is too long for the column's type.",
  P2001 = 'The record searched for in the where condition does not exist.',
  P2002 = 'Unique constraint failed on the field.',
  P2003 = 'Foreign key constraint failed on the field.',
  P2004 = 'A constraint failed on the database.',
  P2025 = 'Record to update not found.',
  // Add more error codes and messages as needed
}

enum PrismaErrorStatusCodes {
  P2000 = HttpStatus.BAD_REQUEST,
  P2001 = HttpStatus.NOT_FOUND,
  P2002 = HttpStatus.CONFLICT,
  P2003 = HttpStatus.BAD_REQUEST,
  P2004 = HttpStatus.BAD_REQUEST,
  P2025 = HttpStatus.NOT_FOUND,
  // Map more error codes to status codes as needed
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the status code from the mapping, default to BAD_REQUEST if not found
    const status =
      PrismaErrorStatusCodes[
        exception.code as keyof typeof PrismaErrorStatusCodes
      ] || HttpStatus.BAD_REQUEST;

    // Get the error message from the mapping
    const errorMessage =
      PrismaErrorMessages[exception.code as keyof typeof PrismaErrorMessages] ||
      'An unknown database error occurred.';

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      field: exception.meta?.target ?? null,
    });
  }
}
