import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { VehicleSummary } from '../../../core/models/vehicle.model';

@Component({
  selector: 'slr-vehicle-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TitleCasePipe],
  template: `
    <article class="slr-card slr-vcard">
      <a [routerLink]="['/rental', vehicle.slug]" class="slr-vcard__media">
        @if (vehicle.primaryImageUrl) {
          <img [src]="vehicle.primaryImageUrl" [alt]="vehicle.name" loading="lazy" />
        } @else {
          <div class="slr-vcard__media-placeholder">{{ vehicle.name.charAt(0) }}</div>
        }
        @if (vehicle.businessVerified) {
          <span class="slr-stamp slr-vcard__stamp">Verified</span>
        }
      </a>

      <div class="slr-vcard__body">
        <a [routerLink]="['/rental', vehicle.slug]" class="slr-vcard__title">{{ vehicle.name }}</a>
        <p class="slr-vcard__meta">
          {{ vehicle.vehicleType | titlecase }} · {{ vehicle.transmission | titlecase }}
        </p>

        <div class="slr-vcard__row">
          <span class="slr-vcard__price">Rs. {{ vehicle.pricePerDay | number: '1.0-0' }}<small>/day</small></span>
          @if (vehicle.ratingCount > 0) {
            <span class="slr-vcard__rating">★ {{ vehicle.ratingAvg | number: '1.1-1' }} · {{ vehicle.ratingCount }} reviews</span>
          }
        </div>

        <p class="slr-vcard__location">📍 {{ vehicle.locationName }}</p>

        <a [routerLink]="['/rental', vehicle.slug]" class="slr-btn slr-btn--primary slr-btn--block">View details</a>
      </div>
    </article>
  `,
  styles: [`
    .slr-vcard { display: flex; flex-direction: column; height: 100%; }
    .slr-vcard__media {
      position: relative;
      display: block;
      aspect-ratio: 4 / 3;
      background: var(--color-primary-tint);
    }
    .slr-vcard__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .slr-vcard__media-placeholder {
      width: 100%; height: 100%;
      display: grid; place-items: center;
      font-family: var(--font-display);
      font-size: 2.5rem;
      color: var(--color-primary);
    }
    .slr-vcard__stamp {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      background: rgba(255,255,255,0.92);
    }
    .slr-vcard__body { padding: var(--space-4); display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .slr-vcard__title { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; color: var(--color-ink); }
    .slr-vcard__meta { color: var(--color-ink-soft); font-size: 0.85rem; margin: 0; }
    .slr-vcard__row { display: flex; align-items: baseline; justify-content: space-between; margin-top: 4px; }
    .slr-vcard__price { font-weight: 700; font-size: 1.1rem; color: var(--color-primary-dark); }
    .slr-vcard__price small { font-weight: 500; font-size: 0.75rem; color: var(--color-ink-soft); }
    .slr-vcard__rating { font-size: 0.8rem; color: var(--color-accent-deep); font-weight: 600; }
    .slr-vcard__location { font-size: 0.8rem; color: var(--color-ink-soft); margin: 0 0 var(--space-3); }
  `],
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: VehicleSummary;
}
