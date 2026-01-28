import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity image source type
export interface SanityImageSource {
    _type?: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

// Sanity client configuration
export const sanityClient = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
    useCdn: true, // Use CDN for faster responses in production
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URL from Sanity image source
 * @param source - Sanity image source object
 * @returns Image URL builder
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
