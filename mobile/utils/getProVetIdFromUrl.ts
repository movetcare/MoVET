export const getProVetIdFromUrl = (url: string | null): number | null => {
  if (url !== null && url?.substring !== undefined) {
    let id: string = url.substring(0, url.length - 1);
    id = id.substring(id.lastIndexOf("/") + 1);
    return parseInt(id);
  } else return null;
};
