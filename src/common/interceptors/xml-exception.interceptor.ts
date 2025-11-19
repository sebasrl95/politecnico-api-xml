import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { XMLBuilder } from 'fast-xml-parser';

@Catch()
export class XmlExceptionFilter implements ExceptionFilter {
  private builder = new XMLBuilder({ ignoreAttributes: false });

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' };

    // Detectar si el cliente quiere XML o JSON
    const wantsXml =
      request.headers['accept']?.includes('application/xml') ||
      request.headers['content-type']?.includes('application/xml');

    if (wantsXml) {
      const xml = this.builder.build({
        error: errorResponse,
      });

      response
        .status(status)
        .setHeader('Content-Type', 'application/xml')
        .send(xml);
    } else {
      response.status(status).json(errorResponse);
    }
  }
}
