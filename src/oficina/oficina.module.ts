import { Module } from '@nestjs/common';
import { OficinaService } from './oficina.service';
import { OficinaController } from './oficina.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Oficina, OficinaSchema } from 'src/entities/oficina.schema';
import { Area, AreaSchema } from 'src/entities/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Oficina.name, schema: OficinaSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [OficinaController],
  providers: [OficinaService],
})
export class OficinaModule {}
