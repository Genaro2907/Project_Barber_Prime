import mongoose, { Schema, Document } from 'mongoose';

export enum ServiceType {
  HAIRCUT = 'Corte Masculino',
  BEARD = 'Barba',
  EYEBROWS = 'Sobrancelha',
  SKIN_CLEANING = 'Limpeza de Pele',
}

export interface IAppointment extends Document {
  customerName: string;
  phoneNumber: string;
  service: ServiceType;
  appointmentDate: string; 
  appointmentTime: string;
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
  service: { 
    type: String, 
    enum: Object.values(ServiceType),
    required: true 
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