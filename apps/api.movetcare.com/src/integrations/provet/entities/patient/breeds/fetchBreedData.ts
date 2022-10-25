import {admin, DEBUG, request, throwError} from "../../../../../config/config";
import {addMinutesToDateObject} from "../../../../../utils/addMinutesToDateObject";
import {sliceArrayIntoChunks} from "../../../../../utils/sliceArrayIntoChunks";

export const fetchBreedData = async (
  breedIds: Array<string>,
  breed: BreedType
): Promise<Array<{value: number; label: string}>> => {
  const breedsData: Array<{value: number; label: string}> = [];
  if (breedIds.length > 50) {
    if (DEBUG)
      console.log(
        "BREED IDS > 50 - ADDING REQUESTS TO TASK QUEUE",
        breedIds.length
      );
    const breedIdChunks = sliceArrayIntoChunks(breedIds, 50);
    if (DEBUG) console.log("breedIdChunks[0]", breedIdChunks[0]);
    breedIdChunks.map(
      async (breedIds: Array<string>, index: number) =>
        index !== 0 &&
        (await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`configure_breeds_${breed?.name}_${index}`)
          .set(
            {
              options: {
                breedIds,
                breed,
              },
              worker: "configure_breeds",
              status: "scheduled",
              performAt: addMinutesToDateObject(new Date(), index),
              createdOn: new Date(),
            },
            {merge: true}
          )
          .then(
            async () =>
              DEBUG &&
              console.log(
                "CONFIGURE BREEDS TASK ADDED TO QUEUE => ",
                `configure_breeds_${index}`
              )
          )
          .catch(async (error: any) => await throwError(error)))
    );
    await Promise.all(
      breedIdChunks[0].map(async (breedId: string) => {
        const initialBreedData = await request
          .get(`/listitem/${breedId}/`)
          .then((result: any) => ({
            value: result?.data?.id,
            label: result?.data?.label,
          }))
          .catch(async (error: any) => {
            if (DEBUG) console.log(error);
            await admin
              .firestore()
              .collection("tasks_queue")
              .doc(`configure_breeds_${breed?.name}_${breedId}`)
              .set(
                {
                  options: {
                    breedIds: [breedId],
                    breed,
                  },
                  worker: "configure_breeds",
                  status: "scheduled",
                  performAt: addMinutesToDateObject(new Date(), 1),
                  createdOn: new Date(),
                },
                {merge: true}
              )
              .then(
                async () =>
                  DEBUG &&
                  console.log(
                    "CONFIGURE BREEDS TASK ADDED TO QUEUE => ",
                    `configure_breeds_${breedId}`
                  )
              )
              .catch(async (error: any) => await throwError(error));
          });
        if (DEBUG) console.log("initialBreedData", initialBreedData);
        if (initialBreedData)
          breedsData.push(initialBreedData as {value: number; label: string});
      })
    );
    if (DEBUG) console.log("breedsData", breedsData);
    return breedsData;
  } else {
    await Promise.all(
      breedIds.map(async (breedId: string) => {
        const breedData = await request
          .get(`/listitem/${breedId}/`)
          .then((result: any) => ({
            value: result?.data?.id,
            label: result?.data?.label,
          }))
          .catch(async (error: any) => {
            if (DEBUG) console.log(error);
            await admin
              .firestore()
              .collection("tasks_queue")
              .doc(`configure_breeds_${breed?.name}_${breedId}`)
              .set(
                {
                  options: {
                    breedIds: [breedId],
                    breed,
                  },
                  worker: "configure_breeds",
                  status: "scheduled",
                  performAt: addMinutesToDateObject(new Date(), 1),
                  createdOn: new Date(),
                },
                {merge: true}
              )
              .then(
                async () =>
                  DEBUG &&
                  console.log(
                    "CONFIGURE BREEDS TASK ADDED TO QUEUE => ",
                    `configure_breeds_${breedId}`
                  )
              )
              .catch(async (error: any) => await throwError(error));
          });
        if (DEBUG) console.log("breedData", breedData);
        if (breedData)
          breedsData.push(breedData as {value: number; label: string});
      })
    );
    if (DEBUG) console.log("breedsData", breedsData);
    return breedsData;
  }
};
