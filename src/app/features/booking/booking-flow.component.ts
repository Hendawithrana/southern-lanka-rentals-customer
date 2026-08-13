import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { VehicleService } from '../../core/services/vehicle.service';
import { BookingService } from '../../core/services/booking.service';
import { LocationService } from '../../core/services/location.service';
import { VehicleDetail } from '../../core/models/vehicle.model';
import { Booking } from '../../core/models/booking.model';
import { Location } from '../../core/models/location.model';

type Step = 'DETAILS' | 'CUSTOMER' | 'SUMMARY' | 'PAYMENT' | 'CONFIRMATION';

@Component({
  selector: 'slr-booking-flow',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  template: `
    @if (vehicle(); as v) {
      <div class="slr-container booking-page">
        <ol class="stepper">
          <li [class.stepper__step--active]="step() === 'DETAILS'" class="stepper__step">1. Rental details</li>
          <li [class.stepper__step--active]="step() === 'CUSTOMER'" class="stepper__step">2. Your details</li>
          <li [class.stepper__step--active]="step() === 'SUMMARY'" class="stepper__step">3. Review</li>
          <li [class.stepper__step--active]="step() === 'PAYMENT'" class="stepper__step">4. Payment</li>
        </ol>

        <div class="booking-page__grid">
          <div class="booking-page__form slr-card">
            @switch (step()) {
              @case ('DETAILS') {
                <h2>Rental details</h2>
                <p class="booking-page__vehicle-name">{{ v.name }} · {{ v.businessName }}</p>

                <div class="slr-field">
                  <label for="pickup-location">Pickup location</label>
                  <select id="pickup-location" [(ngModel)]="pickupLocationId">
                    @for (loc of locations(); track loc.id) {
                      <option [ngValue]="loc.id">{{ loc.name }}</option>
                    }
                  </select>
                </div>
                <div class="booking-page__dates">
                  <div class="slr-field">
                    <label for="pickup-date">Pickup date</label>
                    <input id="pickup-date" type="date" [(ngModel)]="pickupDate" />
                  </div>
                  <div class="slr-field">
                    <label for="pickup-time">Pickup time</label>
                    <input id="pickup-time" type="time" [(ngModel)]="pickupTime" />
                  </div>
                </div>
                <div class="booking-page__dates">
                  <div class="slr-field">
                    <label for="return-date">Return date</label>
                    <input id="return-date" type="date" [(ngModel)]="returnDate" />
                  </div>
                  <div class="slr-field">
                    <label for="return-time">Return time</label>
                    <input id="return-time" type="time" [(ngModel)]="returnTime" />
                  </div>
                </div>
                <button class="slr-btn slr-btn--primary slr-btn--block" [disabled]="days() <= 0" (click)="step.set('CUSTOMER')">
                  Continue
                </button>
              }

              @case ('CUSTOMER') {
                <h2>Your details</h2>
                <div class="slr-field">
                  <label for="full-name">Full name</label>
                  <input id="full-name" type="text" [(ngModel)]="customer.fullName" />
                </div>
                <div class="slr-field">
                  <label for="email">Email</label>
                  <input id="email" type="email" [(ngModel)]="customer.email" />
                </div>
                <div class="slr-field">
                  <label for="phone">Phone</label>
                  <input id="phone" type="tel" [(ngModel)]="customer.phone" />
                </div>
                <div class="slr-field">
                  <label for="country">Country</label>
                  <input id="country" type="text" [(ngModel)]="customer.country" />
                </div>
                <div class="slr-field">
                  <label for="license">Driving licence reference (if required)</label>
                  <input id="license" type="text" [(ngModel)]="customer.licenseReference" />
                </div>
                <div class="booking-page__actions">
                  <button class="slr-btn slr-btn--ghost" (click)="step.set('DETAILS')">Back</button>
                  <button class="slr-btn slr-btn--primary" [disabled]="!customerValid()" (click)="step.set('SUMMARY')">
                    Continue
                  </button>
                </div>
              }

              @case ('SUMMARY') {
                <h2>Review your booking</h2>
                <dl class="summary-list">
                  <div><dt>Vehicle</dt><dd>{{ v.name }}</dd></div>
                  <div><dt>Pickup</dt><dd>{{ pickupDate }} at {{ pickupTime }}</dd></div>
                  <div><dt>Return</dt><dd>{{ returnDate }} at {{ returnTime }}</dd></div>
                  <div><dt>Name</dt><dd>{{ customer.fullName }}</dd></div>
                  <div><dt>Email</dt><dd>{{ customer.email }}</dd></div>
                  <div><dt>Phone</dt><dd>{{ customer.phone }}</dd></div>
                </dl>
                <div class="booking-page__actions">
                  <button class="slr-btn slr-btn--ghost" (click)="step.set('CUSTOMER')">Back</button>
                  <button class="slr-btn slr-btn--primary" [disabled]="submitting()" (click)="submitBooking()">
                    {{ submitting() ? 'Creating booking…' : 'Continue to payment' }}
                  </button>
                </div>
                @if (submitError()) {
                  <p class="booking-page__error">{{ submitError() }}</p>
                }
              }

              @case ('PAYMENT') {
                <h2>Payment</h2>
                <p>
                  Booking <strong>{{ createdBooking()?.bookingReference }}</strong> is reserved for
                  15 minutes while you complete payment.
                </p>
                <div class="slr-field">
                  <label for="card-number">Card number</label>
                  <input id="card-number" type="text" placeholder="•••• •••• •••• ••••" />
                </div>
                <div class="booking-page__dates">
                  <div class="slr-field"><label for="exp">Expiry</label><input id="exp" type="text" placeholder="MM/YY" /></div>
                  <div class="slr-field"><label for="cvc">CVC</label><input id="cvc" type="text" placeholder="•••" /></div>
                </div>
                <p class="booking-page__note">Payments are processed by our payment gateway partner — card details are never stored on our servers.</p>
                <button class="slr-btn slr-btn--primary slr-btn--block" (click)="step.set('CONFIRMATION')">
                  Pay {{ createdBooking()?.totalAmount | number: '1.0-0' }} LKR
                </button>
              }

              @case ('CONFIRMATION') {
                <div class="confirmation">
                  <span class="slr-stamp confirmation__stamp">Booking confirmed</span>
                  <h2>Booking reference: {{ createdBooking()?.bookingReference }}</h2>
                  <dl class="summary-list">
                    <div><dt>Vehicle</dt><dd>{{ createdBooking()?.vehicleName }}</dd></div>
                    <div><dt>Vendor</dt><dd>{{ createdBooking()?.businessName }}</dd></div>
                    <div><dt>Pickup location</dt><dd>{{ createdBooking()?.pickupLocationName }}</dd></div>
                    <div><dt>Total paid</dt><dd>Rs. {{ createdBooking()?.totalAmount | number: '1.0-0' }}</dd></div>
                  </dl>
                  <div class="booking-page__actions">
                    <button class="slr-btn slr-btn--ghost">Download confirmation</button>
                    <a routerLink="/" class="slr-btn slr-btn--primary">Back to home</a>
                  </div>
                </div>
              }
            }
          </div>

          <aside class="booking-page__summary slr-card">
            <h3>Price summary</h3>
            <div class="booking-panel__line">
              <span>{{ days() }} day{{ days() > 1 ? 's' : '' }} × Rs. {{ v.pricePerDay | number: '1.0-0' }}</span>
              <span>Rs. {{ subtotal() | number: '1.0-0' }}</span>
            </div>
            <div class="booking-panel__line">
              <span>Customer service fee</span>
              <span>Rs. {{ estimatedFee() | number: '1.0-0' }}</span>
            </div>
            <div class="booking-panel__line booking-panel__line--total">
              <span>Total</span>
              <span>Rs. {{ total() | number: '1.0-0' }}</span>
            </div>
          </aside>
        </div>
      </div>
    }
  `,
  styles: [`
    .booking-page { padding: var(--space-6) 0 var(--space-8); }
    .stepper { display: flex; gap: var(--space-5); list-style: none; padding: 0; margin: 0 0 var(--space-6); font-size: 0.85rem; font-weight: 600; color: var(--color-ink-soft); }
    .stepper__step--active { color: var(--color-primary); }
    .booking-page__grid { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-6); align-items: start; }
    .booking-page__form { padding: var(--space-6); }
    .booking-page__vehicle-name { color: var(--color-ink-soft); margin-bottom: var(--space-4); }
    .booking-page__dates { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
    .booking-page__actions { display: flex; justify-content: space-between; gap: var(--space-3); margin-top: var(--space-3); }
    .booking-page__note { font-size: 0.8rem; color: var(--color-ink-soft); }
    .booking-page__error { color: var(--color-danger); font-size: 0.88rem; margin-top: var(--space-3); }

    .summary-list { display: flex; flex-direction: column; gap: 10px; margin: var(--space-4) 0; }
    .summary-list div { display: flex; justify-content: space-between; font-size: 0.9rem; }
    .summary-list dt { color: var(--color-ink-soft); }
    .summary-list dd { margin: 0; font-weight: 600; }

    .booking-page__summary { padding: var(--space-5); position: sticky; top: 96px; }
    .booking-panel__line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-ink-soft); padding: 6px 0; }
    .booking-panel__line--total { font-weight: 700; font-size: 1.05rem; color: var(--color-ink); border-top: 1px dashed var(--color-line); margin-top: 6px; padding-top: 12px; }

    .confirmation { text-align: center; padding: var(--space-4) 0; }
    .confirmation__stamp { margin-bottom: var(--space-4); }

    @media (max-width: 860px) {
      .booking-page__grid { grid-template-columns: 1fr; }
    }
  `],
})
export class BookingFlowComponent {
  vehicle = signal<VehicleDetail | null>(null);
  locations = signal<Location[]>([]);
  step = signal<Step>('DETAILS');
  submitting = signal(false);
  submitError = signal<string | null>(null);
  createdBooking = signal<Booking | null>(null);

  pickupLocationId: number | null = null;
  pickupDate = '';
  pickupTime = '10:00';
  returnDate = '';
  returnTime = '10:00';

  customer = { fullName: '', email: '', phone: '', country: '', licenseReference: '' };

  private serviceFeePct = 0.05;

  days = computed(() => {
    if (!this.pickupDate || !this.returnDate) return 0;
    const ms = new Date(this.returnDate).getTime() - new Date(this.pickupDate).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  });

  subtotal = computed(() => (this.vehicle() ? this.days() * this.vehicle()!.pricePerDay : 0));
  estimatedFee = computed(() => Math.round(this.subtotal() * this.serviceFeePct));
  total = computed(() => this.subtotal() + this.estimatedFee());

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private locationService: LocationService,
  ) {
    const slug = this.route.snapshot.paramMap.get('vehicleSlug');
    this.pickupDate = this.route.snapshot.queryParamMap.get('pickupDate') ?? '';
    this.returnDate = this.route.snapshot.queryParamMap.get('returnDate') ?? '';

    if (slug) {
      this.vehicleService.getBySlug(slug).subscribe({ next: (v) => this.vehicle.set(v) });
    }
    this.locationService.listActive().subscribe({ next: (locs) => this.locations.set(locs) });
  }

  customerValid(): boolean {
    return !!(this.customer.fullName && this.customer.email && this.customer.phone);
  }

  submitBooking(): void {
    const v = this.vehicle();
    if (!v) return;

    this.submitting.set(true);
    this.submitError.set(null);

    this.bookingService
      .create({
        vehicleId: Number(v.publicId), // NOTE: backend expects internal Long id - resolve via a lookup-by-slug
        pickupLocationId: this.pickupLocationId!,
        pickupAt: `${this.pickupDate}T${this.pickupTime}:00`,
        returnAt: `${this.returnDate}T${this.returnTime}:00`,
        customerFullName: this.customer.fullName,
        customerEmail: this.customer.email,
        customerPhone: this.customer.phone,
        customerCountry: this.customer.country || undefined,
        licenseReference: this.customer.licenseReference || undefined,
        idempotencyKey: BookingService.newIdempotencyKey(),
      })
      .subscribe({
        next: (booking) => {
          this.createdBooking.set(booking);
          this.submitting.set(false);
          this.step.set('PAYMENT');
        },
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(
            err?.error?.message ?? 'This vehicle is no longer available for the selected dates. Please try different dates.',
          );
        },
      });
  }
}
