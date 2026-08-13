export type VehicleType = 'SCOOTER' | 'MOTORCYCLE' | 'CAR' | 'VAN';
export type Transmission = 'AUTOMATIC' | 'MANUAL';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export interface VehicleSummary {
  publicId: string;
  slug: string;
  name: string;
  vehicleType: VehicleType;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  pricePerDay: number;
  ratingAvg: number;
  ratingCount: number;
  locationName: string;
  businessName: string;
  businessVerified: boolean;
  primaryImageUrl?: string;
}

export interface VehicleDetail extends VehicleSummary {
  images: string[];
  description?: string;
  mileagePolicy?: string;
  helmetIncluded: boolean;
  deliveryAvailable: boolean;
  deliveryFee?: number;
  securityDeposit: number;
  businessResponseRatePct?: number;
  businessActiveSince?: string;
}
