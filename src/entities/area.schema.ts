import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AreaDocument = Area & Document;

@Schema({ collection: 'areas' })
export class Area {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Oficina' }] })
  oficinas: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Salon' }] })
  salones: Types.ObjectId[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
