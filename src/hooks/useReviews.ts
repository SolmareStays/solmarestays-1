import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/services/hostaway';
import { HostawayReview } from '@/types/hostaway';

/**
 * Hook to fetch reviews for a specific property or all properties
 */
export function useReviews(listingId?: string) {
    return useQuery<HostawayReview[], Error>({
        queryKey: ['reviews', listingId || 'all'],
        queryFn: () => fetchReviews(listingId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        enabled: true, // Always enabled
    });
}
