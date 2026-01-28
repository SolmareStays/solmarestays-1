import { defineType, defineField } from 'sanity';

// Hero Section
export const heroSection = defineType({
    name: 'heroSection',
    title: 'Hero Section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Button Link',
            type: 'string',
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
        }),
    ],
});

// Stats Section
export const statsSection = defineType({
    name: 'statsSection',
    title: 'Stats Section',
    type: 'object',
    fields: [
        defineField({
            name: 'introText',
            title: 'Intro Paragraph',
            type: 'text',
        }),
        defineField({
            name: 'stats',
            title: 'Stats Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Value/Title', type: 'string' },
                        { name: 'description', title: 'Label/Description', type: 'string' },
                    ],
                },
            ],
        }),
    ],
});

// Text Section
export const textSection = defineType({
    name: 'textSection',
    title: 'Text Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
        }),
    ],
});

// Feature Grid (Used for Management Section etc)
export const featureGrid = defineType({
    name: 'featureGrid',
    title: 'Management (Feature Grid)',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'icon', title: 'Icon Name (Optional)', type: 'string' },
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' },
                    ],
                },
            ],
        }),
    ],
});

// Location Section
export const locationsSection = defineType({
    name: 'locationsSection',
    title: 'Locations Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'locations',
            title: 'Locations',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' },
                        { name: 'mapLink', title: 'Map Link', type: 'url' },
                    ],
                },
            ],
        }),
    ],
});

// Reviews Section
export const reviewsSection = defineType({
    name: 'reviewsSection',
    title: 'Reviews Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Guest Name', type: 'string' },
                        { name: 'date', title: 'Date', type: 'string' },
                        { name: 'property', title: 'Property Name', type: 'string' },
                        { name: 'rating', title: 'Rating (1-5)', type: 'number' },
                        { name: 'text', title: 'Review Text', type: 'text' },
                    ],
                },
            ],
        }),
    ],
});

// Image Section
export const imageSection = defineType({
    name: 'imageSection',
    title: 'Image Section',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
        }),
    ],
});

// FAQ Section
export const faqSection = defineType({
    name: 'faqSection',
    title: 'FAQ Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'items',
            title: 'FAQ Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', title: 'Question', type: 'string' },
                        { name: 'answer', title: 'Answer', type: 'text' },
                    ],
                },
            ],
        }),
    ],
});

// CTA Section
export const ctaSection = defineType({
    name: 'ctaSection',
    title: 'CTA Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'buttonText',
            title: 'Primary Button Text',
            type: 'string',
        }),
        defineField({
            name: 'buttonLink',
            title: 'Primary Button Link',
            type: 'string',
        }),
        defineField({
            name: 'secondButtonText',
            title: 'Secondary Button Text',
            type: 'string',
        }),
        defineField({
            name: 'secondButtonLink',
            title: 'Secondary Button Link',
            type: 'string',
        }),
    ],
});

// Partners Section (Experience)
export const partnersSection = defineType({
    name: 'partnersSection',
    title: 'Partners Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
        }),
        defineField({
            name: 'partners',
            title: 'Partners',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Partner Name', type: 'string' },
                        { name: 'category', title: 'Category', type: 'string' },
                    ],
                },
            ],
        }),
    ],
});
