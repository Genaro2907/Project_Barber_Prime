// src/controllers/AppointmentController.ts
import { Context } from 'koa';
import { Types } from 'mongoose';
import { Appointment, ProfessionalType, ServiceType } from '../models/Appointment';
import { ApiResponse, AppointmentStatsDTO, CreateAppointmentDTO } from '../types';

export class AppointmentController {
  
  static async create(ctx: Context): Promise<void> {
    try {
      const body = ctx.request.body as CreateAppointmentDTO;
      const { customerName, phoneNumber, service, professional, appointmentDate, appointmentTime } = body;

      // 1. Validação de Campos Obrigatórios
      if (!customerName || !phoneNumber || !service || !professional || !appointmentDate || !appointmentTime) {
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

      const isValidProfessional = Object.values(ProfessionalType).includes(professional as ProfessionalType);
      if (!isValidProfessional) {
        ctx.status = 400;
        const response: ApiResponse = {
          success: false,
          message: 'Invalid professional selected.',
        };
        ctx.body = response;
        return;
      }

      const newAppointment = new Appointment({
        customerName,
        phoneNumber,
        service,
        professional,
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

  static async cancel(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        ctx.status = 400;
        const response: ApiResponse = {
          success: false,
          message: 'Invalid appointment ID.',
        };
        ctx.body = response;
        return;
      }

      const deletedAppointment = await Appointment.findByIdAndDelete(id);

      if (!deletedAppointment) {
        ctx.status = 404;
        const response: ApiResponse = {
          success: false,
          message: 'Appointment not found.',
        };
        ctx.body = response;
        return;
      }

      ctx.status = 200;
      const response: ApiResponse = {
        success: true,
        message: 'Appointment canceled successfully.',
        data: deletedAppointment,
      };
      ctx.body = response;
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);

      ctx.status = 500;
      const response: ApiResponse = {
        success: false,
        message: 'An internal error occurred while canceling the appointment.',
      };
      ctx.body = response;
    }
  }

  static async getStats(ctx: Context): Promise<void> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;

      const totalAppointments = await Appointment.countDocuments();
      const todayAppointments = await Appointment.countDocuments({ appointmentDate: todayDate });

      const mostRequestedServiceResult = await Appointment.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]);

      const mostRequestedService = mostRequestedServiceResult[0]?._id ?? 'Nenhum';
      const mostRequestedServiceCount = mostRequestedServiceResult[0]?.count ?? 0;

      const stats: AppointmentStatsDTO = {
        totalAppointments,
        todayAppointments,
        mostRequestedService,
        mostRequestedServiceCount,
      };

      ctx.status = 200;
      const response: ApiResponse<AppointmentStatsDTO> = {
        success: true,
        message: 'Appointment stats retrieved successfully.',
        data: stats,
      };
      ctx.body = response;
    } catch (error) {
      console.error('❌ Error fetching appointment stats:', error);

      ctx.status = 500;
      const response: ApiResponse = {
        success: false,
        message: 'An internal error occurred while fetching appointment stats.',
      };
      ctx.body = response;
    }
  }
}
