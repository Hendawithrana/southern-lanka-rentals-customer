import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type RentalTab = 'BIKE' | 'CAR';

@Component({
  selector: 'slr-search-widget',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="slr-search slr-card">
      <div class="slr-search__tabs" role="tablist">
        <button
          role="tab"
          [attr.aria-selected]="tab() === 'BIKE'"
          class="slr-search__tab"
          [class.slr-search__tab--active]="tab() === 'BIKE'"
          (click)="tab.set('BIKE')">
          🏍 Bikes &amp; scooters
        </button>
        <button
          role="tab"
          [attr.aria-selected]="tab() === 'CAR'"
          class="slr-search__tab"
          [class.slr-search__tab--active]="tab() === 'CAR'"
          (click)="tab.set('CAR')">
          🚗 Cars
        </button>
      </div>

      <div class="slr-search__fields">
        <div class="slr-field slr-search__field">
          <label for="pickup-location">Pickup location</label>
          <select id="pickup-location" [(ngModel)]="locationSlug" name="locationSlug">
            <option value="">Any location</option>
            <option value="matara">Matara</option>
            <option value="mirissa">Mirissa</option>
            <option value="weligama">Weligama</option>
            <option value="ahangama">Ahangama</option>
            <option value="hiriketiya">Hiriketiya</option>
            <option value="dikwella">Dikwella</option>
            <option value="tangalle">Tangalle</option>
            <option value="dondra">Dondra</option>
            <option value="galle">Galle</option>
          </select>
        </div>

        <div class="slr-field slr-search__field">
          <label for="pickup-date">Pickup date</label>
          <input id="pickup-date" type="date" [(ngModel)]="pickupDate" name="pickupDate" />
        </div>

        <div class="slr-field slr-search__field slr-search__field--narrow">
          <label for="pickup-time">Pickup time</label>
          <input id="pickup-time" type="time" [(ngModel)]="pickupTime" name="pickupTime" />
        </div>

        <div class="slr-field slr-search__field">
          <label for="return-date">Return date</label>
          <input id="return-date" type="date" [(ngModel)]="returnDate" name="returnDate" />
        </div>

        <div class="slr-field slr-search__field slr-search__field--narrow">
          <label for="return-time">Return time</label>
          <input id="return-time" type="time" [(ngModel)]="returnTime" name="returnTime" />
        </div>

        <button class="slr-btn slr-btn--accent slr-search__submit" (click)="search()">Search vehicles</button>
      </div>
    </div>
  `,
  styles: [`
    .slr-search {
      padding: var(--space-5);
      box-shadow: var(--shadow-float);
    }
    .slr-search__tabs { display: flex; gap: var(--space-2); margin-bottom: var(--space-4); }
    .slr-search__tab {
      border: 1px solid var(--color-line);
      background: var(--color-bg);
      border-radius: var(--radius-pill);
      padding: 9px 18px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      color: var(--color-ink-soft);
    }
    .slr-search__tab--active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .slr-search__fields {
      display: grid;
      grid-template-columns: 1.4fr 1fr 0.8fr 1fr 0.8fr auto;
      gap: var(--space-3);
      align-items: end;
    }
    .slr-search__field .slr-field,
    .slr-search__field { margin-bottom: 0; }
    .slr-search__submit { height: 46px; padding-inline: 28px; }

    @media (max-width: 960px) {
      .slr-search__fields { grid-template-columns: 1fr 1fr; }
      .slr-search__submit { grid-column: 1 / -1; }
    }

    @media (max-width: 560px) {
      .slr-search { padding: var(--space-4); }
      .slr-search__fields { grid-template-columns: 1fr; }
    }
  `],
})
export class SearchWidgetComponent {
  tab = signal<RentalTab>('BIKE');
  locationSlug = '';
  pickupDate = '';
  pickupTime = '10:00';
  returnDate = '';
  returnTime = '10:00';

  constructor(private router: Router) {}

  search(): void {
    const queryParams: Record<string, string> = {
      vehicleType: this.tab() === 'BIKE' ? '' : 'CAR', // backend maps BIKE tab to SCOOTER/MOTORCYCLE facet client-side
    };
    if (this.locationSlug) queryParams['locationSlug'] = this.locationSlug;
    if (this.pickupDate) queryParams['pickupAt'] = `${this.pickupDate}T${this.pickupTime}:00`;
    if (this.returnDate) queryParams['returnAt'] = `${this.returnDate}T${this.returnTime}:00`;

    this.router.navigate(['/rentals/search'], { queryParams });
  }
}
