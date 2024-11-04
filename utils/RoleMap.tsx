export const roles = [
  {
    label: "Admin",
    value: "admin",
    color: "green",
  },
  {
    label: "User",
    value: "user",
    color: "blue",
  },
  {
    label: "Venue",
    value: "venue",
    color: "orange",
  },
];

export const getRoleMap = (value: string) => {
  return roles.find((item) => item.value === value);
};
