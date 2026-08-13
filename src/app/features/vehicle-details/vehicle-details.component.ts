import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleDetail } from '../../core/models/vehicle.model';

@Component({
  selector: 'slr-vehicle-details',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, TitleCasePipe],
  template: `
    @if (vehicle(); as v) {
      <div class="slr-container detail-page">
        <div class="detail-page__main">
          <div class="gallery slr-card">
            <img [src]="activeImage()" [alt]="v.name" class="gallery__hero" />
            @if (v.images.length > 1) {
              <div class="gallery__thumbs">
                @for (img of v.images; track img) {
                  <button class="gallery__thumb" [class.gallery__thumb--active]="img === activeImage()" (click)="activeImage.set(img)">
                    <img [src]="img" alt="" />
                  </button>
                }
              </div>
            }
          </div>

          <header class="detail-page__header">
            @if (v.businessVerified) {
              <span class="slr-stamp">Verified vendor</span>
            }
            <h1>{{ v.name }}</h1>
            <p class="detail-page__specs">
              {{ v.transmission | titlecase }} · {{ v.fuelType | titlecase }} · {{ v.seats }} seats
              @if (v.helmetIncluded) { · Helmet included }
              @if (v.deliveryAvailable) { · Delivery available }
            </p>
          </header>

          <section class="detail-page__section">
            <h3>About this vehicle</h3>
            <p>{{ v.description || 'No description provided yet.' }}</p>
          </section>

          <section class="detail-page__section">
            <h3>Vendor</h3>
            <div class="vendor-box slr-card">
              <div>
                <strong>{{ v.businessName }}</strong>
                <p class="vendor-box__meta">
                  📍 {{ v.locationName }}
                  @if (v.ratingCount > 0) { · ★ {{ v.ratingAvg | number: '1.1-1' }} ({{ v.ratingCount }} reviews) }
                  @if (v.businessResponseRatePct) { · {{ v.businessResponseRatePct }}% response rate }
                </p>
              </div>
            </div>
          </section>

          <section class="detail-page__section">
            <h3>Policies</h3>
            <ul class="policy-list">
              <li><strong>Mileage:</strong> {{ v.mileagePolicy || 'Unlimited mileage' }}</li>
              <li><strong>Security deposit:</strong> Rs. {{ v.securityDeposit | number: '1.0-0' }}</li>
              <li><strong>Cancellation:</strong> Free cancellation up to 48 hours before pickup</li>
              <li><strong>Fuel policy:</strong> Return with the same fuel level as pickup</li>
            </ul>
          </section>
        </div>

        <aside class="detail-page__booking">
          <div class="booking-panel slr-card">
            <div class="booking-panel__price">
              Rs. {{ v.pricePerDay | number: '1.0-0' }}<span>/day</span>
            </div>

            <div class="slr-field">
              <label for="pickup-date">Pickup date</label>
              <input id="pickup-date" type="date" [(ngModel)]="pickupDate" />
            </div>
            <div class="slr-field">
              <label for="return-date">Return date</label>
              <input id="return-date" type="date" [(ngModel)]="returnDate" />
            </div>

            @if (days() > 0) {
              <div class="booking-panel__breakdown">
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
              </div>
            }

            <button class="slr-btn slr-btn--primary slr-btn--block" [disabled]="days() <= 0" (click)="proceedToBooking()">
              Book now
            </button>
            <p class="booking-panel__note">You won't be charged yet — review full details on the next step.</p>
          </div>
        </aside>
      </div>

      <div class="sticky-cta">
        <span>Rs. {{ total() | number: '1.0-0' }} total</span>
        <button class="slr-btn slr-btn--primary" [disabled]="days() <= 0" (click)="proceedToBooking()">Book now</button>
      </div>
    } @else if (notFound()) {
      <div class="slr-container detail-page__missing">
        <h2>Vehicle not found</h2>
        <p>This listing may have been removed or is no longer available.</p>
        <a routerLink="/rentals/search" class="slr-btn slr-btn--primary">Browse other vehicles</a>
      </div>
    }
  `,
  styles: [`
    .detail-page {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: var(--space-6);
      padding: var(--space-6) 0 var(--space-8);
      align-items: start;
    }
    .gallery__hero { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .gallery__thumbs { display: flex; gap: 8px; padding: var(--space-3); overflow-x: auto; }
    .gallery__thumb { border: 2px solid transparent; border-radius: var(--radius-sm); padding: 0; width: 72px; height: 54px; overflow: hidden; cursor: pointer; }
    .gallery__thumb img { width: 100%; height: 100%; object-fit: cover; }
    .gallery__thumb--active { border-color: var(--color-primary); }

    .detail-page__header { margin-top: var(--space-5); }
    .detail-page__specs { color: var(--color-ink-soft); font-weight: 600; }
    .detail-page__section { margin-top: var(--space-6); }
    .detail-page__section h3 { margin-bottom: var(--space-3); }

    .vendor-box { padding: var(--space-4); }
    .vendor-box__meta { font-size: 0.88rem; margin: 4px 0 0; }

    .policy-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    .policy-list li { font-size: 0.92rem; color: var(--color-ink-soft); }

    .detail-page__booking { position: sticky; top: 96px; }
    .booking-panel { padding: var(--space-5); }
    .booking-panel__price { font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; color: var(--color-primary-dark); margin-bottom: var(--space-4); }
    .booking-panel__price span { font-size: 0.9rem; font-weight: 500; color: var(--color-ink-soft); }
    .booking-panel__breakdown { margin: var(--space-4) 0; padding-top: var(--space-3); border-top: 1px solid var(--color-line); display: flex; flex-direction: column; gap: 8px; }
    .booking-panel__line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-ink-soft); }
    .booking-panel__line--total { font-weight: 700; font-size: 1.05rem; color: var(--color-ink); padding-top: 8px; border-top: 1px dashed var(--color-line); }
    .booking-panel__note { font-size: 0.78rem; color: var(--color-ink-soft); text-align: center; margin: var(--space-3) 0 0; }

    .sticky-cta { display: none; }
    .detail-page__missing { padding: var(--space-8) 0; text-align: center; }

    @media (max-width: 960px) {
      .detail-page { grid-template-columns: 1fr; }
      .detail-page__booking { position: static; }
      .detail-page__booking .booking-panel { display: none; }
      .sticky-cta {
        display: flex;
        position: sticky;
        bottom: 0;
        justify-content: space-between;
        align-items: center;
        background: var(--color-surface);
        border-top: 1px solid var(--color-line);
        padding: var(--space-3) var(--space-4);
        font-weight: 700;
      }
    }
  `],
})
export class VehicleDetailsComponent {
  vehicle = signal<VehicleDetail | null>(null);
  notFound = signal(false);
  activeImage = signal('');

  pickupDate = '';
  returnDate = '';

  private serviceFeePct = 0.05; // client-side estimate only; the backend computes the authoritative fee at booking time

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
    private router: Router,
    private vehicleService: VehicleService,
  ) {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.vehicleService.getBySlug(slug).subscribe({
        next: (v) => {
          this.vehicle.set(v);
          this.activeImage.set(v.images[0] ?? v.primaryImageUrl ?? '');
        },
        error: () => this.notFound.set(true),
      });
    }
  }

  proceedToBooking(): void {
    const v = this.vehicle();
    if (!v) return;
    this.router.navigate(['/booking', v.slug], {
      queryParams: { pickupDate: this.pickupDate, returnDate: this.returnDate },
    });
  }
}
