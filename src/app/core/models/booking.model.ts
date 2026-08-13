export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'NO_SHOW';

export interface CreateBookingRequest {
  vehicleId: number;
  pickupLocationId: number;
  pickupAt: string;
  returnAt: string;
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry?: string;
  licenseReference?: string;
  idempotencyKey: string;
}

export interface Booking {
  publicId: string;
  bookingReference: string;
  status: BookingStatus;
  vehicleName: string;
  businessName: string;
  pickupLocationName: string;
  pickupAt: string;
  returnAt: string;
  rentalSubtotal: number;
  serviceFeeAmount: number;
  discountAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  currency: string;
}
