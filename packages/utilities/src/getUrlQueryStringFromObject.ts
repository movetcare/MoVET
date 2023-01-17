const getUrlQueryStringFromObject = (object: any) =>
  object &&
  Object.keys(object).length === 0 &&
  Object.getPrototypeOf(object) === Object.prototype
    ? ""
    : "?" +
      Object.keys(object)
        .map((key) => key + "=" + object[key])
        .join("&");

export default getUrlQueryStringFromObject;
