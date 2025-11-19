import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Empleado, EmpleadoSchema } from 'src/entities/empleado.schema';
import { Area, AreaSchema } from 'src/entities/area.schema';
import { Oficina, OficinaSchema } from 'src/entities/oficina.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Empleado.name, schema: EmpleadoSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Oficina.name, schema: OficinaSchema },
    ]),
  ],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
