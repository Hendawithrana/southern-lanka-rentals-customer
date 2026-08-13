import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleSummary, VehicleType, Transmission, FuelType } from '../../core/models/vehicle.model';
import { VehicleSearchParams } from '../../core/models/search.model';

@Component({
  selector: 'slr-search-results',
  standalone: true,
  imports: [FormsModule, VehicleCardComponent],
  template: `
    <div class="slr-container search-page">
      <aside class="search-page__filters slr-card">
        <h3>Filters</h3>

        <div class="slr-field">
          <label for="f-type">Vehicle type</label>
          <select id="f-type" [(ngModel)]="filters.vehicleType" (ngModelChange)="applyFilters()">
            <option [ngValue]="undefined">All types</option>
            <option value="SCOOTER">Scooter</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="CAR">Car</option>
            <option value="VAN">Van</option>
          </select>
        </div>

        <div class="slr-field">
          <label for="f-transmission">Transmission</label>
          <select id="f-transmission" [(ngModel)]="filters.transmission" (ngModelChange)="applyFilters()">
            <option [ngValue]="undefined">Any</option>
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        <div class="slr-field">
          <label for="f-fuel">Fuel</label>
          <select id="f-fuel" [(ngModel)]="filters.fuelType" (ngModelChange)="applyFilters()">
            <option [ngValue]="undefined">Any</option>
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div class="slr-field">
          <label for="f-seats">Minimum seats</label>
          <input id="f-seats" type="number" min="1" [(ngModel)]="filters.minSeats" (ngModelChange)="applyFilters()" />
        </div>

        <div class="slr-field">
          <label for="f-min-price">Price range (Rs./day)</label>
          <div class="search-page__price-row">
            <input id="f-min-price" type="number" placeholder="Min" [(ngModel)]="filters.minPrice" (ngModelChange)="applyFilters()" />
            <input type="number" placeholder="Max" [(ngModel)]="filters.maxPrice" (ngModelChange)="applyFilters()" />
          </div>
        </div>

        <label class="search-page__checkbox">
          <input type="checkbox" [(ngModel)]="filters.deliveryOnly" (ngModelChange)="applyFilters()" />
          Delivery available
        </label>
      </aside>

      <section class="search-page__results">
        <div class="search-page__toolbar">
          <span>{{ totalResults() }} vehicles found</span>
          <div class="slr-field search-page__sort">
            <label for="sort">Sort by</label>
            <select id="sort" [(ngModel)]="filters.sort" (ngModelChange)="applyFilters()">
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="rating">Rating</option>
              <option value="popular">Most popular</option>
            </select>
          </div>
        </div>

        @if (loading()) {
          <p>Searching…</p>
        } @else if (results().length === 0) {
          <div class="slr-card search-page__empty">
            <h3>No vehicles match those filters</h3>
            <p>Try widening your price range or choosing a nearby location.</p>
          </div>
        } @else {
          <div class="search-page__grid">
            @for (vehicle of results(); track vehicle.publicId) {
              <slr-vehicle-card [vehicle]="vehicle" />
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .search-page {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: var(--space-6);
      padding: var(--space-6) 0 var(--space-8);
      align-items: start;
    }
    .search-page__filters {
      position: sticky;
      top: 96px;
      padding: var(--space-5);
    }
    .search-page__filters h3 { margin-bottom: var(--space-4); }
    .search-page__price-row { display: flex; gap: 8px; }
    .search-page__price-row input { border: 1px solid var(--color-line); border-radius: var(--radius-sm); padding: 10px; width: 100%; }
    .search-page__checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; }
    .search-page__toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-5);
      font-weight: 600;
      color: var(--color-ink-soft);
    }
    .search-page__sort { margin: 0; flex-direction: row; align-items: center; gap: 8px; }
    .search-page__sort select { padding: 8px 10px; }
    .search-page__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-5);
    }
    .search-page__empty { padding: var(--space-6); text-align: center; }

    @media (max-width: 960px) {
      .search-page { grid-template-columns: 1fr; }
      .search-page__grid { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class SearchResultsComponent {
  results = signal<VehicleSummary[]>([]);
  totalResults = signal(0);
  loading = signal(false);

  filters: VehicleSearchParams = { page: 0, size: 12, sort: 'recommended' };

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.filters = {
        ...this.filters,
        locationSlug: params.get('locationSlug') ?? undefined,
        vehicleType: (params.get('vehicleType') as VehicleType) || undefined,
        transmission: (params.get('transmission') as Transmission) || undefined,
        fuelType: (params.get('fuelType') as FuelType) || undefined,
        pickupAt: params.get('pickupAt') ?? undefined,
        returnAt: params.get('returnAt') ?? undefined,
      };
      this.fetch();
    });

    const routeData = this.route.snapshot.data as { vehicleCategory?: 'BIKE' | 'CAR' };
    if (routeData['vehicleCategory'] === 'CAR') {
      this.filters.vehicleType = 'CAR';
    }
  }

  applyFilters(): void {
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    if (!this.filters.deliveryOnly) {
      this.filters.deliveryOnly = false;
    }
    this.vehicleService.search(this.filters).subscribe({
      next: (result) => {
        this.results.set(result.content);
        this.totalResults.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
      },
    });
  }
}
