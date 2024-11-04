import { api } from './api';
import { AuthService } from './auth.service';
import { BookingService } from './booking.service';
import { ChatService } from './chat.service';
import { SessionService } from './session.service';
import { VenueService } from './venue.service';

export const authService = new AuthService(api);
export const venueService = new VenueService(api);
export const sessionService = new SessionService(api);
export const chatService = new ChatService(api);
export const bookingService = new BookingService(api);

export * from './types/common';
export * from './types/auth';
export * from './types/venue';
export * from './types/session';
export * from './types/chat';
export * from './types/booking';
