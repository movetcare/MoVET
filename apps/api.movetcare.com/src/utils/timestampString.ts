export const timestampString = (
  date: Date = new Date(),
  dividerType: "/" | "_" = "/"
): string =>
  dividerType === "/"
    ? date.getUTCFullYear() +
      "/" +
      ("0" + (date.getUTCMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getUTCDate()).slice(-2) +
      "" +
      ("0" + date.getUTCHours()).slice(-2) +
      ":" +
      ("0" + date.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + date.getUTCSeconds()).slice(-2)
    : date.getUTCFullYear() +
      "_" +
      ("0" + (date.getUTCMonth() + 1)).slice(-2) +
      "_" +
      ("0" + date.getUTCDate()).slice(-2) +
      "_" +
      ("0" + date.getUTCHours()).slice(-2) +
      "_" +
      ("0" + date.getUTCMinutes()).slice(-2) +
      "_" +
      ("0" + date.getUTCSeconds()).slice(-2);
