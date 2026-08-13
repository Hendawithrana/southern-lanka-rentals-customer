import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '../../../core/models/location.model';

@Component({
  selector: 'slr-location-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/rentals/search']" [queryParams]="{ locationSlug: location.slug }" class="slr-card slr-lcard">
      <div class="slr-lcard__media" [style.backgroundImage]="bgImage">
        <div class="slr-lcard__overlay"></div>
        <span class="slr-lcard__name">{{ location.name }}</span>
      </div>
      <div class="slr-lcard__foot">
        <span>{{ location.vehicleCount ?? '—' }} vehicles available</span>
        <span class="slr-lcard__cta">Explore rentals →</span>
      </div>
    </a>
  `,
  styles: [`
    .slr-lcard { display: block; }
    .slr-lcard__media {
      position: relative;
      aspect-ratio: 5 / 4;
      background-size: cover;
      background-position: center;
      background-color: var(--color-primary-tint);
      display: flex;
      align-items: flex-end;
      padding: var(--space-4);
    }
    .slr-lcard__overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(7,53,49,0.75), rgba(7,53,49,0) 55%);
    }
    .slr-lcard__name {
      position: relative;
      color: #fff;
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 600;
    }
    .slr-lcard__foot {
      padding: 14px var(--space-4);
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: var(--color-ink-soft);
    }
    .slr-lcard__cta { color: var(--color-primary); font-weight: 700; }
  `],
})
export class LocationCardComponent {
  @Input({ required: true }) location!: Location;

  get bgImage(): string {
    return this.location.heroImageUrl ? `url(${this.location.heroImageUrl})` : 'none';
  }
}
