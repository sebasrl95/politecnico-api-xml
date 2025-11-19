import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRunningMessage(): { status: string; message: string } {
    return {
      status: 'OK',
      message: 'API Colegio Cambridge running!',
    };
  }
}
