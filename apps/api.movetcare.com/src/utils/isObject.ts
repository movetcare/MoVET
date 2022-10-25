export const isObject = (obj: any) =>
  Object.prototype.toString.call(obj) === "[object Object]";
