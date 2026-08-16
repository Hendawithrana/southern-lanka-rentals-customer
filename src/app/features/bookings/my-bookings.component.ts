import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingCardComponent } from '../../shared/components/booking-card/booking-card.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking, BookingStatus } from '../../core/models/booking.model';

// Same "still active" set as the booking card's cancellable statuses -
// everything else (cancelled/rejected/completed/expired/no-show) is history.
const ONGOING_STATUSES: readonly BookingStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_FAILED',
  'PENDING_CONFIRMATION',
  'CONFIRMED',
];

@Component({
  selector: 'slr-my-bookings',
  standalone: true,
  imports: [RouterLink, BookingCardComponent],
  template: `
    <div class="slr-container bookings-page">
      <h1>My bookings</h1>

      @if (loading()) {
        <p>Loading your bookings…</p>
      } @else if (bookings().length === 0) {
        <div class="slr-card bookings-page__empty">
          <h3>No bookings yet</h3>
          <p>Once you book a vehicle, it'll show up here.</p>
          <a routerLink="/rentals/search" class="slr-btn slr-btn--primary">Browse rentals</a>
        </div>
      } @else {
        @if (cancelError()) {
          <p class="bookings-page__error">{{ cancelError() }}</p>
        }

        <section class="bookings-page__section">
          <h2>Ongoing</h2>
          @if (ongoing().length === 0) {
            <p class="bookings-page__muted">No ongoing bookings.</p>
          } @else {
            <div class="bookings-page__list">
              @for (booking of ongoing(); track booking.publicId) {
                <slr-booking-card
                  [booking]="booking"
                  [cancelling]="cancellingId() === booking.publicId"
                  (cancel)="cancelBooking(booking)" />
              }
            </div>
          }
        </section>

        <section class="bookings-page__section">
          <h2>History</h2>
          @if (history().length === 0) {
            <p class="bookings-page__muted">No past bookings.</p>
          } @else {
            <div class="bookings-page__list">
              @for (booking of history(); track booking.publicId) {
                <slr-booking-card [booking]="booking" />
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .bookings-page { padding: var(--space-6) 0 var(--space-8); }
    .bookings-page__section { margin-top: var(--space-6); }
    .bookings-page__section h2 { margin-bottom: var(--space-4); }
    .bookings-page__muted { color: var(--color-ink-soft); }
    .bookings-page__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-4);
    }
    .bookings-page__empty { padding: var(--space-6); text-align: center; }
    .bookings-page__error { color: var(--color-danger); font-size: 0.9rem; margin: 0 0 var(--space-4); }
  `],
})
export class MyBookingsComponent {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  cancellingId = signal<string | null>(null);
  cancelError = signal<string | null>(null);

  ongoing = computed(() => this.bookings().filter((b) => ONGOING_STATUSES.includes(b.status)));
  history = computed(() => this.bookings().filter((b) => !ONGOING_STATUSES.includes(b.status)));

  constructor(private bookingService: BookingService) {
    this.fetch();
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Cancel booking ${booking.bookingReference}? This can't be undone.`)) return;

    this.cancellingId.set(booking.publicId);
    this.cancelError.set(null);
    this.bookingService.cancel(booking.publicId).subscribe({
      next: (updated) => {
        this.bookings.update((list) => list.map((b) => (b.publicId === updated.publicId ? updated : b)));
        this.cancellingId.set(null);
      },
      error: (err) => {
        this.cancellingId.set(null);
        this.cancelError.set(err?.error?.message ?? 'Could not cancel this booking. Please try again.');
      },
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.bookingService.listMine().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
