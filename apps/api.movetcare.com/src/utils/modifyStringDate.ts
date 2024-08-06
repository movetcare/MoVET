/* eslint-disable @typescript-eslint/no-unused-expressions */
export const modifyDateString = (date: string) => {
  const dateArray = date.split("-");
  dateArray[0].length === 4
    ? dateArray.push(dateArray.splice(0, 1)[0])
    : dateArray.unshift(dateArray.splice(2, 1)[0]);
  return dateArray.join("-");
};
