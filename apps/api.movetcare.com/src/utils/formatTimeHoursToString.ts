import { DEBUG } from "../config/config";
export const formatTimeHoursToString = (time: number): string => {
  if (DEBUG) {
    console.log("time", time);
    console.log("time.toString().length", time.toString().length);
    if (time.toString().length === 3) {
      console.log(
        "0 - ",
        [`0${time}`.slice(0, 2), ":", `0${time}`.slice(2)].join("")
      );
    } else if (time.toString().length === 4) {
      console.log(
        "1 - ",
        [`${time}`.slice(0, 2), ":", `${time}`.slice(2)].join("")
      );
    } else {
      console.log(
        "2 - ",
        [`${time}`.slice(0, 2), ":", `${time}`.slice(3)].join("")
      );
    }
  }
  return time.toString().length === 3
    ? new Date(
        new Date().toLocaleString("en-US", {
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
    : time.toString().length === 4
    ? new Date(
        new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
          " " +
          [`${time}`.slice(0, 2), ":", `${time}`.slice(2)].join("") +
          ":00"
      ).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
    : new Date(
        new Date().toLocaleString("en-US", {
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
};
