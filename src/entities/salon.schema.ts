import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalonDocument = Salon & Document;

@Schema({ collection: 'salones' })
export class Salon {
  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: true })
  area: Types.ObjectId;
}

export const SalonSchema = SchemaFactory.createForClass(Salon);
