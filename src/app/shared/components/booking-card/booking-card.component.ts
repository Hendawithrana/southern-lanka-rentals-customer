import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: 'Payment pending',
  PAYMENT_FAILED: 'Payment failed',
  PENDING_CONFIRMATION: 'Awaiting vendor confirmation',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected by vendor',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired',
  NO_SHOW: 'No-show',
};

const STATUS_BADGE: Record<BookingStatus, 'success' | 'accent' | 'danger'> = {
  PENDING_PAYMENT: 'accent',
  PAYMENT_FAILED: 'danger',
  PENDING_CONFIRMATION: 'accent',
  CONFIRMED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'danger',
  COMPLETED: 'success',
  EXPIRED: 'danger',
  NO_SHOW: 'danger',
};

// Mirrors the backend's Booking::ALLOWED_TRANSITIONS - only these statuses
// can still transition to CANCELLED, so only these get a cancel button.
const CANCELLABLE_STATUSES: readonly BookingStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_FAILED',
  'PENDING_CONFIRMATION',
  'CONFIRMED',
];

@Component({
  selector: 'slr-booking-card',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <article class="slr-card bcard">
      <div class="bcard__head">
        <div>
          <a [routerLink]="['/rental', booking.vehicleSlug]" class="bcard__vehicle">{{ booking.vehicleName }}</a>
          <p class="bcard__vendor">{{ booking.businessName }} · {{ booking.pickupLocationName }}</p>
        </div>
        <span class="slr-badge" [class]="'slr-badge--' + statusBadge()">{{ statusLabel() }}</span>
      </div>

      <div class="bcard__dates">
        <div>
          <span class="bcard__label">Pickup</span>
          <strong>{{ booking.pickupAt | date: 'mediumDate' }} · {{ booking.pickupAt | date: 'shortTime' }}</strong>
        </div>
        <div>
          <span class="bcard__label">Return</span>
          <strong>{{ booking.returnAt | date: 'mediumDate' }} · {{ booking.returnAt | date: 'shortTime' }}</strong>
        </div>
      </div>

      <div class="bcard__foot">
        <span class="bcard__ref">{{ booking.bookingReference }}</span>
        <span class="bcard__total">Rs. {{ booking.totalAmount | number: '1.0-0' }}</span>
      </div>

      @if (isCancellable()) {
        <button
          class="slr-btn slr-btn--ghost slr-btn--block bcard__cancel"
          [disabled]="cancelling"
          (click)="cancel.emit()">
          {{ cancelling ? 'Cancelling…' : 'Cancel booking' }}
        </button>
      }
    </article>
  `,
  styles: [`
    .bcard { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
    .bcard__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
    .bcard__vehicle { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; color: var(--color-ink); }
    .bcard__vendor { font-size: 0.85rem; margin: 2px 0 0; }
    .bcard__dates { display: flex; gap: var(--space-5); flex-wrap: wrap; padding: var(--space-3) 0; border-top: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); }
    .bcard__dates > div { display: flex; flex-direction: column; gap: 2px; }
    .bcard__label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--color-ink-soft); }
    .bcard__dates strong { font-size: 0.92rem; }
    .bcard__foot { display: flex; justify-content: space-between; align-items: center; }
    .bcard__ref { font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-ink-soft); }
    .bcard__total { font-weight: 700; color: var(--color-primary-dark); }
    .bcard__cancel { color: var(--color-danger); border-color: var(--color-danger-tint); }
    .bcard__cancel:hover:not(:disabled) { background: var(--color-danger-tint); }
  `],
})
export class BookingCardComponent {
  @Input({ required: true }) booking!: Booking;
  @Input() cancelling = false;
  @Output() cancel = new EventEmitter<void>();

  statusLabel(): string {
    return STATUS_LABEL[this.booking.status];
  }

  statusBadge(): string {
    return STATUS_BADGE[this.booking.status];
  }

  isCancellable(): boolean {
    return CANCELLABLE_STATUSES.includes(this.booking.status);
  }
}
