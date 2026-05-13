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
  professional: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface VerifyPinDTO {
  pin: string;
}

export interface AppointmentStatsDTO {
  totalAppointments: number;
  todayAppointments: number;
  mostRequestedService: string;
  mostRequestedServiceCount: number;
}
