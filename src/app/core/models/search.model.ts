import { VehicleType, Transmission, FuelType } from './vehicle.model';

export interface VehicleSearchParams {
  locationSlug?: string;
  vehicleType?: VehicleType;
  transmission?: Transmission;
  fuelType?: FuelType;
  minSeats?: number;
  minPrice?: number;
  maxPrice?: number;
  deliveryOnly?: boolean;
  pickupAt?: string;
  returnAt?: string;
  page?: number;
  size?: number;
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
