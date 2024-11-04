export const venueStatus = [
  {
    label: "Active",
    value: "active",
    color: "green",
  },
  {
    label: "Inactive",
    value: "inactive",
    color: "red",
  },
  {
    label: "Pending",
    value: "pending",
    color: "blue",
  },
  {
    label: "Suspended",
    value: "suspended",
    color: "yellow",
  },
];

export const getVenueStatusMap = (value: string) => {
  return venueStatus.find((item) => item.value === value);
};
