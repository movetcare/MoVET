export const getDateStringFromDate = (
  date: Date,
  format: "timeOnly" | "dateOnly" | "full" = "full"
): string =>
  format === "timeOnly"
    ? `${date.toLocaleString("en-US", {
        timeZone: "America/Denver",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`
    : format === "dateOnly"
    ? `${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
        new Date(date)
      )} ${new Date(date)?.toLocaleString("en-us", {
        month: "long",
      })} ${new Date(date).getDate()}`
    : `${new Date(date)?.toDateString()} @ ${date?.toLocaleTimeString("en-US", {
        timeZone: "America/Denver",
        timeZoneName: "short",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      })}`;
