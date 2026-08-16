import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  create(req: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings`, req);
  }

  listMine(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${API_BASE_URL}/bookings`);
  }

  getByPublicId(publicId: string): Observable<Booking> {
    return this.http.get<Booking>(`${API_BASE_URL}/bookings/${publicId}`);
  }

  cancel(publicId: string, reason?: string): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings/${publicId}/cancel`, null, {
      params: reason ? { reason } : {},
    });
  }

  /** Generates a stable per-checkout-attempt key so a retried submit never creates a duplicate booking. */
  static newIdempotencyKey(): string {
    return crypto.randomUUID();
  }
}
