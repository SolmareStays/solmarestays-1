import { HostawayListing, HostawayListingsResponse } from '@/types/hostaway';
import { Property } from '@/data/properties';

const API_URL = import.meta.env.VITE_HOSTAWAY_API_URL || 'https://api.hostaway.com/v1';
const API_TOKEN = import.meta.env.VITE_HOSTAWAY_API_TOKEN;

/**
 * Generate a URL-friendly slug from a property name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate unit type description based on bedroom count
 */
function getUnitType(bedroomsNumber: number | null): string {
  if (bedroomsNumber === null || bedroomsNumber === 0) {
    return 'Studio Bungalow';
  }
  const bedroomWord = bedroomsNumber === 1 ? 'One Bedroom' :
    bedroomsNumber === 2 ? 'Two Bedroom' :
      bedroomsNumber === 3 ? 'Three Bedroom' :
        bedroomsNumber === 4 ? 'Four Bedroom' :
          `${bedroomsNumber} Bedroom`;
  return `${bedroomWord} House`;
}

/**
 * Transform Hostaway listing to Property interface
 */
function transformListing(listing: HostawayListing): Property {
  // Get images from API
  const images = listing.listingImages
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      src: img.url,
      alt: img.caption || listing.name,
    }));

  // Get the first image as the main thumbnail
  const mainImage = images.length > 0 ? images[0].src : listing.thumbnailUrl;

  // Extract amenity names
  const amenities = listing.listingAmenities
    .slice(0, 10) // Limit to 10 amenities for display
    .map((a) => a.amenityName);

  return {
    id: String(listing.id),
    slug: generateSlug(listing.name),
    name: listing.name,
    location: listing.city,
    unitType: getUnitType(listing.bedroomsNumber),
    sleeps: listing.personCapacity,
    bedrooms: listing.bedroomsNumber ?? 0,
    bathrooms: listing.bathroomsNumber,
    startingPrice: listing.price,
    image: mainImage,
    images: images.length > 0 ? images : [{ src: mainImage, alt: listing.name }],
    description: listing.description,
    amenities,
    hostawayListingId: String(listing.id),
  };
}

/**
 * Fetch all listings from Hostaway API
 */
export async function fetchListings(): Promise<Property[]> {
  if (!API_TOKEN) {
    throw new Error('Hostaway API token is not configured. Please set VITE_HOSTAWAY_API_TOKEN in .env');
  }

  const response = await fetch(`${API_URL}/listings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Cache-control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
  }

  const data: HostawayListingsResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error('Hostaway API returned an error');
  }

  return data.result.map(transformListing);
}

/**
 * Fetch a single listing by ID from Hostaway API
 */
export async function fetchListingById(id: string): Promise<Property | null> {
  if (!API_TOKEN) {
    throw new Error('Hostaway API token is not configured. Please set VITE_HOSTAWAY_API_TOKEN in .env');
  }

  const response = await fetch(`${API_URL}/listings/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Cache-control': 'no-cache',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch listing: ${response.status} ${response.statusText}`);
  }

  const data: { status: string; result: HostawayListing } = await response.json();

  if (data.status !== 'success') {
    throw new Error('Hostaway API returned an error');
  }

  return transformListing(data.result);
}
