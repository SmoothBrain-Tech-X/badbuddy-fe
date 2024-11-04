import React from 'react';
import { Box, Group, Title, ActionIcon } from '@mantine/core';
import { IconHeart, IconShare } from '@tabler/icons-react';
import { SessionData } from '@/services';


const PartyHeader: React.FC<{
    party: SessionData;
    isLiked: boolean;
    onLikeToggle: () => void;
}> = ({ party, isLiked, onLikeToggle }) => (
    <Box bg="blue.6" p="xl" color="white">
        <Group justify="space-between" align="flex-start">
            <div>
                <Title order={2} mb="xs" c="white">{party.title}</Title>
                {/* <Group gap="xs">
                    <Badge color="blue.1" c="white">{party.level}</Badge>
                    <Badge color="blue.1" c="white">{party.price}</Badge>
                </Group> */}
            </div>
            <Group gap="xs">
                <ActionIcon
                    variant="subtle"
                    color="white"
                    onClick={onLikeToggle}
                >
                    <IconHeart
                        style={{ fill: isLiked ? 'white' : 'none' }}
                        stroke={1.5}
                    />
                </ActionIcon>
                <ActionIcon variant="subtle" color="white">
                    <IconShare stroke={1.5} />
                </ActionIcon>
            </Group>
        </Group>
    </Box>
);

export default PartyHeader;