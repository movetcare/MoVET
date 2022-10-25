export const parseStringToJson = (jsonString: string) => {
  try {
    const object = JSON.parse(jsonString);
    if (object && typeof object === "object") {
      return object;
    }
  } catch {
    false;
  }
  return false;
};
