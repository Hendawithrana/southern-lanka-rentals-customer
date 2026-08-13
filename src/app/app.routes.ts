import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Southern Lanka Rentals — Rent a Bike or Car in Southern Sri Lanka',
  },
  {
    // /bike-rental/mirissa, /car-rental/matara, or /rentals/search?type=CAR&locationSlug=galle
    path: 'rentals/search',
    loadComponent: () =>
      import('./features/search/search-results.component').then((m) => m.SearchResultsComponent),
    title: 'Search rentals — Southern Lanka Rentals',
  },
  {
    path: 'bike-rental/:locationSlug',
    loadComponent: () =>
      import('./features/search/search-results.component').then((m) => m.SearchResultsComponent),
    data: { vehicleCategory: 'BIKE' },
  },
  {
    path: 'car-rental/:locationSlug',
    loadComponent: () =>
      import('./features/search/search-results.component').then((m) => m.SearchResultsComponent),
    data: { vehicleCategory: 'CAR' },
  },
  {
    path: 'rental/:slug',
    loadComponent: () =>
      import('./features/vehicle-details/vehicle-details.component').then((m) => m.VehicleDetailsComponent),
    title: 'Vehicle details — Southern Lanka Rentals',
  },
  {
    path: 'booking/:vehicleSlug',
    loadComponent: () => import('./features/booking/booking-flow.component').then((m) => m.BookingFlowComponent),
    title: 'Book your rental — Southern Lanka Rentals',
  },
  {
    path: 'booking/confirmation/:bookingReference',
    loadComponent: () => import('./features/booking/booking-flow.component').then((m) => m.BookingFlowComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Log in — Southern Lanka Rentals',
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Create account — Southern Lanka Rentals',
  },
  { path: '**', redirectTo: '' },
];
