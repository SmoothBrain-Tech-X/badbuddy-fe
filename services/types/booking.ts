export type CourtBookingRequestDTO = {
  court_id: string | number;
  date: string;
  start_time: string;
  end_time: string;
};
export type PaymentResponse = {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
};

export type BookingResponse = {
  id: string;
  court_name: string;
  venue_name: string;
  venue_location: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  payment?: PaymentResponse;
};
export interface Booking {
  id: string;
  court_name: string;
  venue_name: string;
  venue_location: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BookingResponseDTO {
  message: string;
  data: Booking[];
}
export interface CreateBookingResponseDTO {
  message: string;
  data: Booking;
}

export interface BookingConflictTimeSlot {
  start_time: string;
  end_time: string;
  status: string;
}

export interface BookingConflictData {
  court_id: string;
  court_name: string;
  date: string;
  available: boolean;
  time_slots: null | any[]; // You can specify a more specific type if needed
  conflicts: BookingConflictTimeSlot[] | null;
}

export interface BookingConflictDTO {
  message: string;
  data: BookingConflictData;
}

export interface PaymentRequestDTO {
  payment_method: string;
  amount: number;
  transaction_id: string;
}
