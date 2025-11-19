import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OficinaDocument = Oficina & Document;

@Schema({ collection: 'oficinas' })
export class Oficina {
  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: true })
  area: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Empleado' }] })
  empleados: Types.ObjectId[];
}

export const OficinaSchema = SchemaFactory.createForClass(Oficina);
