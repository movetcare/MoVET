import { DEBUG } from "../config/config";
// const DEBUG = true;
export const formatTimeHoursToDate = (time: string): Date => {
  const hours =
    time.toString().length === 3
      ? `0${time}`.slice(0, 2)
      : `${time}`.slice(0, 2);
  const minutes =
    time.toString().length === 3
      ? `0${time}`.slice(2)
      : `${time}`.slice(3)?.length === 1
      ? "0" + `${time}`.slice(3)
      : `${time}`.slice(3);
  if (DEBUG) {
    console.log("time", time);
    console.log("hours", hours);
    console.log("minutes", minutes);
  }
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Denver",
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
      " " +
      [hours, ":", minutes].join("") +
      ":00"
  );
};
