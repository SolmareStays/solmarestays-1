export interface Property {
  id: string;
  slug: string;
  name: string;
  location: string;
  unitType: string;
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
  startingPrice: number;
  image: string;
  images: { src: string; alt: string }[];
  description: string;
  amenities: string[];
  hostawayListingId?: string;
}
