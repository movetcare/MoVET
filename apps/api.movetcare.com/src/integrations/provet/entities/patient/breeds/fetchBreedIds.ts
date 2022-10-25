import {throwError, request} from "../../../../../config/config";

export const fetchBreedIds = async (
  breedListId: string
): Promise<Array<string> | boolean> =>
  await request
    .get(`/list/${breedListId}/`)
    .then(async (response: any) => {
      const {data} = response;
      if (data.is_active) {
        const breeds: Array<string> = [];
        data.items.forEach((value: any) => {
          let id: string = value.substring(0, value.length - 1);
          id = id.substring(id.lastIndexOf("/") + 1);
          breeds.push(id);
        });
        return breeds;
      } else
        return throwError({
          message: `Breeds List Unavailable => ${JSON.stringify(data)}`,
        });
    })
    .catch(async (error: any) => await throwError(error));
