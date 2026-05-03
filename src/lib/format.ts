const conditionLabels: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  REFURBISHED: "Refurbished",
  PARTS_ONLY: "Parts only",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PENDING: "Pending",
  SOLD: "Sold",
};

export function formatCondition(value: string): string {
  return conditionLabels[value] ?? value;
}

export function formatStatus(value: string): string {
  return statusLabels[value] ?? value;
}
