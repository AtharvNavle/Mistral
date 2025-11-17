const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

export const formatDateLabel = (value: number) =>
  dateFormatter.format(new Date(value));

export const formatTimeLabel = (value: number) =>
  timeFormatter.format(new Date(value));

