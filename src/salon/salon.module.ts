import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Salon, SalonSchema } from 'src/entities/salon.schema';
import { Area, AreaSchema } from 'src/entities/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Salon.name, schema: SalonSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
