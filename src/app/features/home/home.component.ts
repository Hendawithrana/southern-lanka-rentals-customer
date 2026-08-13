import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchWidgetComponent } from '../../shared/components/search-widget/search-widget.component';
import { LocationCardComponent } from '../../shared/components/location-card/location-card.component';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { LocationService } from '../../core/services/location.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { Location } from '../../core/models/location.model';
import { VehicleSummary } from '../../core/models/vehicle.model';
import { VENDOR_APP_URL } from '../../core/services/app-links';

@Component({
  selector: 'slr-home',
  standalone: true,
  imports: [RouterLink, SearchWidgetComponent, LocationCardComponent, VehicleCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  popularLocations = signal<Location[]>([]);
  popularVehicles = signal<VehicleSummary[]>([]);
  vendorRegisterUrl = `${VENDOR_APP_URL}/register`;

  constructor(
    private locationService: LocationService,
    private vehicleService: VehicleService,
  ) {
    // Curated for the homepage per the spec; falls back to the full active list from the API.
    this.locationService.listActive().subscribe({
      next: (locations) => {
        const featured = ['mirissa', 'weligama', 'matara', 'hiriketiya', 'dikwella', 'tangalle'];
        const bySlug = new Map(locations.map((l) => [l.slug, l]));
        this.popularLocations.set(featured.map((slug) => bySlug.get(slug)).filter((l): l is Location => !!l));
      },
      error: () => this.popularLocations.set([]),
    });

    this.vehicleService.search({ sort: 'popular', size: 8 }).subscribe({
      next: (result) => this.popularVehicles.set(result.content),
      error: () => this.popularVehicles.set([]),
    });
  }
}
