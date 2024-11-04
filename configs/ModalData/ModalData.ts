import { OpenConfirmModal } from '@mantine/modals/lib/context';

export const ConfirmDeleteModalData: OpenConfirmModal = {
  title: 'Confirm Delete',
  children: 'Are you sure you want to delete ?',
  labels: {
    confirm: 'Delete',
    cancel: 'Cancel',
  },
  confirmProps: {
    color: 'red',
  },
};

export const ConfirmModalData: OpenConfirmModal = {
  title: 'Confirm',
  children: 'Are you sure you want to confirm ?',
  labels: {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  confirmProps: {
    color: 'blue',
  },
};
