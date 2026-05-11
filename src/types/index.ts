export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface CreateAppointmentDTO {
  customerName: string;
  phoneNumber: string;
  service: string; 
  appointmentDate: string;
  appointmentTime: string;
}