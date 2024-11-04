import React from 'react';
import {
    Stack,
    Paper,
    Group,
    Text,
    Center,
    Box,
    Progress,
    Avatar,
    Divider,
    Card,
    rem
} from '@mantine/core';
import {
    IconStarFilled,
    IconMessage
} from '@tabler/icons-react';
import { Review, CreateReviewDTO } from '@/services';
import CreateReview from './CreateReview';

interface ReviewsTabProps {
    reviews: Review[];
    rating: number;
    total_reviews: number;
    onSubmit: (values: CreateReviewDTO) => Promise<void>;

}

const calculateRatingPercentage = (reviews: Review[], targetRating: number): number => {
    if (reviews.length === 0) return 0;
    const ratingCount = reviews.filter(review => review.rating === targetRating).length;
    return (ratingCount / reviews.length) * 100;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


const StarRating = ({ rating }: { rating: number }) => (
    <Group gap={2}>
        {Array.from({ length: 5 }).map((_, index) => (
            <IconStarFilled
                key={index}
                size={rem(16)}
                style={{
                    color: index < rating ? '#FAB005' : '#E7E7E9',
                    width: rem(16),
                    height: rem(16)
                }}
            />
        ))}
    </Group>
);

const ReviewsTab = ({ reviews, rating, total_reviews, onSubmit }: ReviewsTabProps) => (
    <Stack gap="lg">
        <Card shadow="sm" radius="md" withBorder>
            <Stack>
                <Group justify="center" gap="xl" py="md">
                    <Stack align="center" gap={4}>
                        <Text size="xl" fw={700} className="text-blue-600">
                            {rating.toFixed(1)}
                        </Text>
                        <Group gap={2}>
                            <StarRating rating={rating} />
                        </Group>
                        <Group gap={4} align="center">
                            <IconMessage size={14} className="text-gray-500" />
                            <Text size="sm" c="dimmed">
                                {total_reviews.toLocaleString()} reviews
                            </Text>
                        </Group>
                    </Stack>
                    <Divider orientation="vertical" />
                    <Box w={300}>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <Group key={star} gap="xs" mb={6}>
                                <Group gap={4} w={40}>
                                    <Text size="sm" c="dimmed">{star}</Text>
                                    <IconStarFilled size={12} className="text-yellow-400" />
                                </Group>
                                <Progress
                                    value={calculateRatingPercentage(reviews, star)}
                                    size="sm"
                                    color="yellow"
                                    style={{ flex: 1 }}
                                    radius="xl"
                                />
                                <Text size="xs" c="dimmed" w={40} ta="right">
                                    {Math.round(calculateRatingPercentage(reviews, star))}%
                                </Text>
                            </Group>
                        ))}
                    </Box>
                </Group>
            </Stack>
        </Card>

        <Stack gap="md">
            {reviews.map((review) => (
                <Card key={review.id} shadow="sm" radius="md" withBorder>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Group>
                                <Avatar
                                    src={review.reviewer.avatar_url}
                                    radius="xl"
                                    size="md"
                                    alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                                    className="border-2 border-blue-100"
                                >
                                    {review.reviewer.first_name[0]}
                                    {review.reviewer.last_name[0]}
                                </Avatar>
                                <div>
                                    <Text fw={600} className="text-blue-600">
                                        {review.reviewer.first_name} {review.reviewer.last_name}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {formatDate(review.created_at)}
                                    </Text>
                                </div>
                            </Group>
                            <Group gap={2}>
                                <StarRating rating={review.rating} />

                            </Group>
                        </Group>

                        <Text size="sm" className="text-gray-600 leading-relaxed">
                            {review.comment}
                        </Text>
                    </Stack>
                </Card>
            ))}
        </Stack>

        {reviews.length === 0 && (
            <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                    <IconMessage size={48} color='gray'
                    />
                    <Text c="dimmed" fw={500}>No reviews yet</Text>
                </Stack>
            </Card>
        )}
        <CreateReview
            onSubmit={onSubmit}
            isLoading={false}
        />
    </Stack>
);

export default ReviewsTab;