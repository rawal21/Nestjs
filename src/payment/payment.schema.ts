import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.schema';
import { Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, queue: true })
  orderId: string;
  @Prop()
  paymentId?: string;
  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'created' })
  status: 'created' | 'paid' | 'failed' | 'refunded';

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Object })
  meta: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
