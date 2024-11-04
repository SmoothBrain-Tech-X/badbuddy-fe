import { Api } from './api';
import {
  BookingConflictDTO,
  BookingResponse,
  BookingResponseDTO,
  CourtBookingRequestDTO,
  CreateBookingResponseDTO,
  PaymentRequestDTO,
} from './types/booking';

export class BookingService {
  constructor(private api: Api) {}

  async getMyBooking(): Promise<BookingResponseDTO> {
    return this.api.get<BookingResponseDTO>(`/bookings/user/me?include_history=true`);
  }

  async createBooking(bookingData: CourtBookingRequestDTO): Promise<CreateBookingResponseDTO> {
    return this.api.post<CreateBookingResponseDTO>(`/bookings`, bookingData);
  }

  async cancelBooking(booking_id: string): Promise<BookingResponse> {
    return this.api.post<BookingResponse>(`/bookings/${booking_id}/cancel`);
  }

  async checkAvailability(bookingData: CourtBookingRequestDTO): Promise<BookingConflictDTO> {
    return this.api.get<BookingConflictDTO>(`/bookings/availability`, { params: bookingData });
  }

  async createPayment(
    booking_id: string,
    paymentParams: PaymentRequestDTO
  ): Promise<PaymentResponse> {
    return this.api.post<PaymentResponse>(`/bookings/${booking_id}/payment`, paymentParams);
  }
}
