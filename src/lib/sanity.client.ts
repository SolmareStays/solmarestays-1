import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Sanity image source type
export interface SanityImageSource {
    _type?: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

// Sanity client configuration
// NOTE: Vite only exposes environment variables prefixed with VITE_
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-05-03';

console.log('Sanity Config:', { projectId, dataset, apiVersion });

if (!projectId) {
    console.error('Missing VITE_SANITY_PROJECT_ID. Please ensure your .env file has VITE_SANITY_PROJECT_ID set.');
}

export const sanityClient = createClient({
    projectId: projectId || 'ubjffxhw', // Fallback to hardcoded ID if env missing
    dataset: dataset || 'production',
    apiVersion: apiVersion,
    useCdn: true, // Use CDN for faster responses in production
});

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);

/**
 * Generate optimized image URL from Sanity image source
 * @param source - Sanity image source object
 * @returns Image URL builder
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
