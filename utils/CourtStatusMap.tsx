export const courtStatus = [
  {
    label: "Available",
    value: "available",
    color: "green",
  },
  {
    label: "Occupied",
    value: "occupied",
    color: "orange",
  },
  {
    label: "Maintenance",
    value: "maintenance",
    color: "red",
  },
  {
    label: "Reserved",
    value: "reserved",
    color: "blue",
  },
];

export const getCourtStatusMap = (value: string) => {
  return courtStatus.find((item) => item.value === value);
};
