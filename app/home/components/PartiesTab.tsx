import { Stack, Button } from '@mantine/core';
import { Party } from '../types';
import { PartyCard } from './PartyCard';

interface PartiesTabProps {
    parties: Party[];
}

export const PartiesTab: React.FC<PartiesTabProps> = ({ parties }) => (
    <Stack>
        {parties.map((party) => (
            <PartyCard key={party.id} party={party} />
        ))}
        <Button variant="light" fullWidth>
            See More Party
        </Button>
    </Stack>
);
