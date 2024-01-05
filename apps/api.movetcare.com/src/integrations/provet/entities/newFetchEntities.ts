import { admin, throwError } from "../../../config/config";
import * as func from "firebase-functions";
import { fetchNewProVetAccessToken } from "../fetchNewProVetAccessToken";
const axios = require("axios").default;
const DEBUG = false;
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
    | "user"
    | "resource",
  entityId: number | null = null,
  filter: string | null = null,
): Promise<any> => {
  const { accessToken, refreshToken } = await admin
    .firestore()
    .collection("configuration")
    .doc("provet")
    .get()
    .then((doc: any) => {
      return {
        accessToken: doc.data()?.access_token,
        refreshToken: doc.data()?.refresh_token,
      };
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) console.log("PROVET TOKENS: ", { accessToken, refreshToken });
  if (accessToken) {
    axios.defaults.baseURL = func.config()?.provet_cloud?.api_base;
    (axios.defaults.headers as any).common["Authorization"] =
      `Bearer ${accessToken}` as any;
    (axios.defaults.headers as any).common["User-Agent"] = "MoVET/3.0";
    (axios.defaults.headers as any).post["Content-Type"] = "application/json";
    let queryUrl = entityId ? `/${entity}/${entityId}` : `/${entity}/`;
    if (entity === "email") queryUrl = `/logs/email/${entityId}`;
    if (filter) queryUrl += filter;
    if (DEBUG) console.log("QUERY URL => ", queryUrl);
    const initialQuery = await axios
      .get(queryUrl)
      .then(async (response: any) => {
        const { data, status } = response;
        if (DEBUG)
          console.log(`fetchEntity - PROVET API RESPONSE - ${queryUrl} =>`, {
            data,
            status,
          });
        return status !== 200 && status !== 201 ? false : data;
      })
      .catch(async (error: any) => {
        if (error.message.includes("401")) {
          const newAccessToken = await fetchNewProVetAccessToken(refreshToken);
          if (DEBUG) console.log("newAccessToken", newAccessToken);
          if (newAccessToken) {
            return await axios
              .get(queryUrl)
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    `(RETRY) fetchEntity - PROVET API RESPONSE - ${queryUrl} =>`,
                    {
                      data,
                      status,
                    },
                  );
                return status !== 200 && status !== 201 ? false : data;
              })
              .catch(async (error: any) => throwError(error));
          } else return throwError(error);
        } else return throwError(error);
      });
    if (entityId) return initialQuery;
    else if (initialQuery?.num_pages === 1) return initialQuery?.results;
    else {
      const resultsCount = initialQuery?.count;
      let resultsAdded = 0;
      const allResults: Array<any> = [];
      const queryUrls: Array<string> = [];
      for (let i = 0; i < initialQuery?.results?.length; i++) {
        allResults.push(initialQuery?.results[i]);
        resultsAdded++;
      }
      for (let i = 2; i <= initialQuery?.num_pages; i++) {
        queryUrls.push(
          filter
            ? `/${entity}/?page=${i}${filter.replace("?", "&")}`
            : `/${entity}/?page=${i}`,
        );
      }
      const requests = queryUrls.map(
        async (url: string) =>
          await axios
            .get(url)
            .then((result: any) => {
              for (let i = 0; i < result?.data?.results.length; i++) {
                allResults.push(result?.data?.results[i]);
                resultsAdded++;
              }
            })
            .catch((error: any) => throwError(error)),
      );
      return Promise.all(requests)
        .then(() => {
          if (resultsCount === resultsAdded) return allResults;
          else
            return throwError({
              message:
                "Failed to Complete Paginated Query => " +
                JSON.stringify(initialQuery) +
                " PAYLOAD => " +
                JSON.stringify({ entity, entityId, filter }),
            }) as any;
        })
        .catch((error: any) => throwError(error));
    }
  } else return throwError({ message: "MISSING ACCESS TOKEN" });
};
