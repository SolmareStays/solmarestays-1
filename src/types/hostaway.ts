/**
 * Hostaway API Types
 * Based on the API response structure from https://api.hostaway.com/v1/listings
 */

export interface HostawayListingImage {
  id: number;
  caption: string;
  bookingEngineCaption: string | null;
  airbnbCaption: string;
  vrboCaption: string | null;
  url: string;
  sortOrder: number;
}

export interface HostawayAmenity {
  id: number;
  amenityId: number;
  amenityName: string;
}

export interface HostawayBedType {
  id: number;
  bedTypeId: number;
  quantity: number;
  bedroomNumber: number;
}

export interface HostawayListing {
  id: number;
  propertyTypeId: number;
  name: string;
  externalListingName: string;
  internalListingName: string;
  description: string;
  thumbnailUrl: string;
  houseRules: string | null;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  street: string;
  address: string;
  publicAddress: string;
  zipcode: string;
  price: number;
  starRating: number | null;
  weeklyDiscount: number | null;
  monthlyDiscount: number | null;
  personCapacity: number;
  lat: number;
  lng: number;
  checkInTimeStart: number;
  checkInTimeEnd: number;
  checkOutTime: number;
  cancellationPolicy: string;
  squareMeters: number;
  roomType: string;
  bathroomType: string;
  bedroomsNumber: number | null;
  bedsNumber: number;
  bathroomsNumber: number;
  minNights: number;
  maxNights: number;
  cleaningFee: number;
  instantBookable: number;
  currencyCode: string;
  timeZoneName: string;
  wifiUsername: string | null;
  wifiPassword: string | null;
  listingAmenities: HostawayAmenity[];
  listingBedTypes: HostawayBedType[];
  listingImages: HostawayListingImage[];
  averageReviewRating: number | null;
  airbnbListingUrl: string | null;
  vrboListingUrl: string | null;
}

export interface HostawayListingsResponse {
  status: string;
  result: HostawayListing[];
}
