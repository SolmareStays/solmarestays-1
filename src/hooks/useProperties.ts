import { useQuery } from '@tanstack/react-query';
import { fetchListings } from '@/services/hostaway';
import { Property } from '@/data/properties';

/**
 * Hook to fetch all properties from Hostaway API
 */
export function useProperties() {
  return useQuery<Property[], Error>({
    queryKey: ['properties'],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
}

/**
 * Hook to get a single property by slug
 * Uses the properties list and filters by slug
 */
export function usePropertyBySlug(slug: string) {
  const { data: properties, ...rest } = useProperties();

  const property = properties?.find((p) => p.slug === slug);

  return {
    ...rest,
    data: property,
  };
}

/**
 * Hook to get featured properties (first 4)
 */
export function useFeaturedProperties() {
  const { data: properties, ...rest } = useProperties();

  return {
    ...rest,
    data: properties?.slice(0, 4),
  };
}
