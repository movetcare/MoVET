export const isObject = (obj: object): boolean =>
  Object.prototype.toString.call(obj) === "[object Object]";
