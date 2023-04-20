export const formatDateObjectPlusTimeStringIntoString = (
  dateString: Date = new Date(),
  timeString = "09:00"
) =>
  `${dateString.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  })} @ ${new Date("February 04, 2022 " + timeString + ":00").toLocaleString(
    "en-US",
    {
      timeZone: "America/Denver",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  )}`;
