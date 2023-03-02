export const parseStringToJson = (jsonString: string): boolean | object => {
  try {
    const object: object = JSON.parse(jsonString);
    if (object && typeof object === "object") {
      return object;
    }
  } catch {
    return false;
  }
  return false;
};
