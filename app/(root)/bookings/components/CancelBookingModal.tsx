import { Modal, Text, Button, Group } from '@mantine/core';

interface CancelBookingModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const CancelBookingModal = ({
    opened,
    onClose,
    onConfirm,
    loading = false,
}: CancelBookingModalProps) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title="Cancel Booking"
        centered
    >
        <Text size="sm" mb="lg">
            Are you sure you want to cancel this booking? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
            <Button variant="light" onClick={onClose} disabled={loading}>
                Keep Booking
            </Button>
            <Button
                color="red"
                onClick={onConfirm}
                loading={loading}
            >
                Yes, Cancel Booking
            </Button>
        </Group>
    </Modal>
);

export default CancelBookingModal;