import { Injectable, NestMiddleware } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlBodyMiddleware implements NestMiddleware {
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  use(req: any, res: any, next: () => void) {
    const contentType = req.headers['content-type'];

    // Solo procesar XML, si no es XML continuar normal
    if (!contentType || !contentType.includes('application/xml')) {
      return next();
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsed = this.parser.parse(body);
        console.log('Parsed XML Body:', parsed);

        // Normalizar raíz cuando contiene un solo objeto
        if (typeof parsed === 'object' && parsed !== null) {
          const keys = Object.keys(parsed);
          if (keys.length === 1 && typeof parsed[keys[0]] === 'object') {
            req.body = parsed[keys[0]];
          } else {
            req.body = parsed;
          }
        } else {
          req.body = parsed;
        }

        console.log('Normalized Body:', req.body);
        next();
      } catch (err) {
        console.error('XML parsing error:', err);
        res.status(400).send({ error: 'Invalid XML' });
      }
    });

    // Seguridad: en caso de error de stream, continuar
    req.on('error', () => next());
  }
}
