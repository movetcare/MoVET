import {request, throwError, DEBUG} from "../../../config/config";

export const fetchEntity = async (
  entity:
    | "item"
    | "invoice"
    | "invoicepayment"
    | "invoicerow"
    | "client"
    | "patient"
    | "appointment"
    | "department"
    | "shift"
    | "hook/webhook"
    | "reason_group"
    | "reason"
    | "reminder"
    | "consultation"
    // | 'appointment_reminder'
    | "remindertemplate"
    | "cancellationreason"
    | "email"
    | "userdetails"
    | "user",
  entityId: number | null = null,
  filter: string | null = null
): Promise<any> => {
  let queryUrl = entityId ? `/${entity}/${entityId}` : `/${entity}/`;
  if (entity === "email") queryUrl = `/logs/email/${entityId}`;
  if (filter) queryUrl += filter;
  if (DEBUG) console.log("QUERY URL => ", queryUrl);
  const initialQuery = await request
    .get(queryUrl)
    .then(async (response: any) => {
      const {data, status} = response;
      if (DEBUG) console.log(`API Response: GET ${queryUrl} =>`, data);
      return status !== 200 && status !== 201 ? "ERROR" : data;
    })
    .catch(() => false);

  if (entityId) return initialQuery;
  else if (initialQuery?.num_pages === 1) return initialQuery?.results;
  else {
    const resultsCount = initialQuery?.count;
    let resultsAdded = 0;
    const allResults: Array<any> = [];
    const queryUrls: Array<string> = [];

    for (let i = 0; i < initialQuery?.results.length; i++) {
      allResults.push(initialQuery?.results[i]);
      resultsAdded++;
    }

    for (let i = 2; i <= initialQuery?.num_pages; i++) {
      queryUrls.push(
        filter
          ? `/${entity}/?page=${i}${filter.replace("?", "&")}`
          : `/${entity}/?page=${i}`
      );
    }

    const requests = queryUrls.map(
      async (url: string) =>
        await request
          .get(url)
          .then((result: any) => {
            for (let i = 0; i < result?.data?.results.length; i++) {
              allResults.push(result?.data?.results[i]);
              resultsAdded++;
            }
          })
          .catch((error: any) => throwError(error))
    );

    return Promise.all(requests)
      .then(() => {
        if (resultsCount === resultsAdded) return allResults;
        else return throwError("Failed to Complete Paginated Query") as any;
      })
      .catch((error: any) => throwError(error));
  }
};
