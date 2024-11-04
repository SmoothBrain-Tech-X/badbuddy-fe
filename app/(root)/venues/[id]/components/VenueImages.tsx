import React from 'react';
import { Image, SimpleGrid } from '@mantine/core';

interface VenueImagesProps {
    images: string | string[];
}

const VenueImages: React.FC<VenueImagesProps> = ({ images }) => {
    const imageArray = (typeof images === 'string' ? images.split(',') : images)
        .filter(img => img && img.trim() !== '');

    if (imageArray.length === 0) {
        return null;
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="md">
            {imageArray.map((image, index) => (
                <Image
                    key={`${image}-${index}`}
                    src={image.trim()}
                    alt={`Venue image ${index + 1}`}
                    radius="md"
                    fallbackSrc="/api/placeholder/400/300"
                />
            ))}
        </SimpleGrid>
    );
};

export default VenueImages;