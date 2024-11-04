import React from 'react';
import { useForm } from '@mantine/form';
import { zodResolver } from '@mantine/form';
import { z } from 'zod';
import {
    Paper,
    Stack,
    Group,
    Button,
    Textarea,
    Text,
} from '@mantine/core';
import {
    IconStarFilled,
    IconStar
} from '@tabler/icons-react';

// Zod schema for review
const reviewSchema = z.object({
    rating: z.number().min(1).max(5, { message: 'Please select a rating' }),
    comment: z.string()
        .min(10, { message: 'Review must be at least 10 characters' })
        .max(500, { message: 'Review cannot exceed 500 characters' })
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface CreateReviewProps {
    onSubmit: (values: ReviewFormValues) => Promise<void>;
    isLoading?: boolean;
}

const CreateReview = ({ onSubmit, isLoading = false }: CreateReviewProps) => {
    const form = useForm<ReviewFormValues>({
        initialValues: {
            rating: 0,
            comment: '',
        },
        validate: zodResolver(reviewSchema),
    });

    const [hoveredRating, setHoveredRating] = React.useState(0);

    return (
        <Paper radius="md" withBorder p="md">
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap="md">
                    <div>
                        <Text size="sm" fw={500} mb={4}>
                            Your Rating
                        </Text>
                        <Group gap={2}>
                            {Array.from({ length: 5 }).map((_, index) => {
                                const starValue = index + 1;
                                const Icon = (hoveredRating || form.values.rating) >= starValue
                                    ? IconStarFilled
                                    : IconStar;

                                return (
                                    <Button
                                        key={index}
                                        variant="subtle"
                                        color="yellow"
                                        size="sm"
                                        p={0}
                                        onClick={() => form.setFieldValue('rating', starValue)}
                                        onMouseEnter={() => setHoveredRating(starValue)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                    >
                                        <Icon
                                            size={24}
                                            stroke={1.5}
                                            className={
                                                (hoveredRating || form.values.rating) >= starValue
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }
                                        />
                                    </Button>
                                );
                            })}
                        </Group>
                        {form.errors.rating && (
                            <Text size="xs" c="red" mt={4}>
                                {form.errors.rating}
                            </Text>
                        )}
                    </div>

                    <Textarea
                        label="Your Review"
                        placeholder="Share your experience with this venue (min. 10 characters)"
                        minRows={4}
                        maxLength={500}
                        {...form.getInputProps('comment')}
                    />

                    <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                            {form.values.comment.length}/500 characters
                        </Text>
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading || !form.values.rating}
                        >
                            Submit Review
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
};


export default CreateReview;