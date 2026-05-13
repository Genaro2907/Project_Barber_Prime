import mongoose, { Schema, Document } from 'mongoose';

export enum ServiceType {
  HAIRCUT = 'Corte Masculino',
  BEARD = 'Barba',
  EYEBROWS = 'Sobrancelha',
  SKIN_CLEANING = 'Limpeza de Pele',
}

export enum ProfessionalType {
  THIAGO = 'Thiago',
  MARCOS = 'Marcos',
  RAFAEL = 'Rafael',
  BRUNO = 'Bruno',
}

export interface IAppointment extends Document {
  customerName: string;
  phoneNumber: string;
  services: ServiceType[];
  professional: ProfessionalType;
  appointmentDate: string;
  appointmentTime: string;
  totalPrice: number;
  createdAt: Date;
}


const AppointmentSchema: Schema = new Schema({
  customerName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  services: [{ 
    type: String, 
    enum: Object.values(ServiceType),
    required: true 
  }],
  professional: {
    type: String,
    enum: Object.values(ProfessionalType),
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  appointmentDate: { 
    type: String, 
    required: true 
  },
  appointmentTime: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
