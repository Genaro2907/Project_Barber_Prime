// src/controllers/AppointmentController.ts
import { Context } from 'koa';
import { Appointment, ServiceType } from '../models/Appointment';
import { ApiResponse, CreateAppointmentDTO } from '../types';

export class AppointmentController {
  
  static async create(ctx: Context): Promise<void> {
    try {
      const body = ctx.request.body as CreateAppointmentDTO;
      const { customerName, phoneNumber, service, appointmentDate, appointmentTime } = body;

      // 1. Validação de Campos Obrigatórios
      if (!customerName || !phoneNumber || !service || !appointmentDate || !appointmentTime) {
        ctx.status = 400; // Bad Request
        const response: ApiResponse = {
          success: false,
          message: 'Validation failed.',
          errors: ['All fields are required.'],
        };
        ctx.body = response;
        return;
      }

      const isValidService = Object.values(ServiceType).includes(service as ServiceType);
      if (!isValidService) {
        ctx.status = 400;
        const response: ApiResponse = {
          success: false,
          message: 'Invalid service selected.',
        };
        ctx.body = response;
        return;
      }

      const newAppointment = new Appointment({
        customerName,
        phoneNumber,
        service,
        appointmentDate,
        appointmentTime,
      });

      await newAppointment.save();

      ctx.status = 201; 
      const response: ApiResponse = {
        success: true,
        message: 'Appointment successfully created!',
        data: newAppointment,
      };
      ctx.body = response;

    } catch (error) {
      console.error('❌ Error creating appointment:', error);

      ctx.status = 500; 
      const response: ApiResponse = {
        success: false,
        message: 'An internal error occurred while processing your request.',
      };
      ctx.body = response;
    }
  }

  static async getAll(ctx: Context): Promise<void> {
    try {
      const appointments = await Appointment.find().sort({ appointmentDate: 1, appointmentTime: 1 });

      ctx.status = 200; // OK
      const response: ApiResponse = {
        success: true,
        message: 'Appointments retrieved successfully',
        data: appointments,
      };
      
      ctx.body = response;

    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      
      ctx.status = 500;
      const response: ApiResponse = {
        success: false,
        message: 'An internal error occurred while fetching appointments.',
      };
      ctx.body = response;
    }
  }
}