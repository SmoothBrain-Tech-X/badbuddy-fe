import { type NotificationData } from "@mantine/notifications";

export const SuccessNotificationData: NotificationData = {
  title: "Success",
  message: "Success",
  color: "teal",
  loading: false,
};

export const ErrorNotificationData: NotificationData = {
  title: "Error",
  message: "Failed",
  color: "red",
  loading: false,
};

export const LoadingNotificationData: NotificationData = {
  title: "Loading",
  message: "Updating venue...",
  color: "gray",
  loading: true,
};

export const ConfirmDeleteNotificationData: NotificationData = {
  title: "Confirm Delete",
  message: "Are you sure you want to delete ?",
  color: "red",
};
