import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as js2xmlparser from 'js2xmlparser';
import { Types } from 'mongoose';

@Injectable()
export class XmlInterceptor implements NestInterceptor {
  /**
   * Limpia objetos provenientes de Mongo/Mongoose:
   * - Convierte ObjectId a string
   * - Convierte Buffer a hex (evita caracteres ilegales en XML)
   * - Elimina metadatos como $__, _doc, etc.
   */
  private sanitize(value: any): any {
    // ✔ Convierte ObjectId a string
    if (value instanceof Types.ObjectId) {
      return value.toString();
    }

    // ✔ Evita binarios en XML
    if (Buffer.isBuffer(value)) {
      return value.toString('hex');
    }

    // ✔ Si el valor es una cadena XML válida, no lo procesamos (prevenir doble codificación)
    if (typeof value === 'string' && value.startsWith('<?xml')) {
      return value; // Devuelve directamente el XML si es una cadena XML válida
    }

    // ✔ Procesa arrays
    if (Array.isArray(value)) {
      return value.map((v) => this.sanitize(v));
    }

    // ✔ Procesa objetos
    if (value !== null && typeof value === 'object') {
      const obj: any = {};
      Object.keys(value).forEach((key) => {
        if (key.startsWith('$')) return; // Elimina internals de Mongoose
        if (key === '_doc') return; // Elimina metadata _doc
        obj[key] = this.sanitize(value[key]);
      });
      return obj;
    }

    return value;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<any>();
    const res = ctx.getResponse<any>();

    const acceptHeader = req.headers?.accept || '';
    const wantsXml =
      acceptHeader.includes('application/xml') || req.query?.format === 'xml';

    if (!wantsXml) return next.handle();

    return next.handle().pipe(
      map((data) => {
        try {
          if (data === null || data === undefined) {
            res.setHeader('Content-Type', 'application/xml');
            return js2xmlparser.parse('response', {});
          }

          // ⬇️ SANITIZA ANTES DE CONVERTIR
          const cleanData = this.sanitize(data);

          // Selección de etiqueta raíz
          const rootName = Array.isArray(cleanData) ? 'items' : 'response';

          const xml = js2xmlparser.parse(rootName, cleanData);

          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          return xml;
        } catch (err) {
          throw new HttpException(
            { message: 'Error serializando a XML', details: err.message },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }),
    );
  }
}
