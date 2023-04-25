export const formatTimeHoursToString = (time: number): string =>
  time.toString().length === 3
    ? new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/Denver",
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
          " " +
          [`0${time}`.slice(0, 2), ":", `0${time}`.slice(2)].join("") +
          ":00"
      ).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
    : new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/Denver",
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
          " " +
          [`${time}`.slice(0, 2), ":", `${time}`.slice(3)].join("") +
          ":00"
      ).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
