import { functions, proVetApiUrl, request, throwError } from "../config/config";
import { logEvent } from "../utils/logging/logEvent";
// import { Storage } from "@google-cloud/storage";
const DEBUG = true;
export const newPreviousVetRecords = functions.storage
  .object()
  .onFinalize(async (object: any) => {
    const pathParts = object.name.split("/");
    if (DEBUG) {
      console.log("newPreviousVetRecords object", object);
      console.log("newPreviousVetRecords pathParts", pathParts);
    }
    if (pathParts[0] === "clients" && pathParts[3] !== "new") {
      if (pathParts[4] === "records") {
        await request
          .post("/note/", {
            title: "Previous Clinical History Provided by Client",
            type: 10,
            client: proVetApiUrl + `/client/${pathParts[1]}/`,
            patients: [proVetApiUrl + `/patient/${pathParts[3]}/`],
            note:
              object.mediaLink.includes("127.0.0.1") ||
              object.mediaLink.includes("localhost")
                ? `<a href="${object.mediaLink
                    .replaceAll("127.0.0.1", "movetcare.com")
                    .replaceAll(
                      "localhost",
                      "movetcare.com"
                    )}">Click Here to View PDF (LINK IS BROKEN)</a>`
                : `<a href="${object.mediaLink}">Click Here to View PDF</a>`,
          })
          .then(async (response: any) => {
            const { data } = response;
            if (DEBUG) console.log("API Response: POST /note/ => ", data);
            await logEvent({
              tag: "previous-clinical-history-received",
              origin: "api",
              success: false,
              data: {
                message: "Previous Clinical History Provided by Client",
              },
              sendToSlack: true,
            });
          })
          .catch(async (error: any) => await throwError(error));
        // await admin
        //   .storage()
        //   .bucket(object.bucket)
        //   .file(object.name)
        //   .getSignedUrl({
        //     action: "read",
        //     expires: "03-09-2040",
        //   })
        //   .then(
        //     async (signedUrls: any) =>
        //       await request
        //         .post("/note/", {
        //           title: `Previous Clinical History Provided by Client - ${pathParts[5]} (${signedUrls[0]})`,
        //           type: 10,
        //           client: proVetApiUrl + `/client/${pathParts[1]}/`,
        //           patients: [proVetApiUrl + `/patient/${pathParts[3]}/`],
        //           note: `<a href="${signedUrls[0]}">${signedUrls[0]}</a>`,
        //         })
        //         .then(async (response: any) => {
        //           const { data } = response;
        //           if (DEBUG) console.log("API Response: POST /note/ => ", data);
        //           await logEvent({
        //             tag: "1-hour-booking-abandonment-email",
        //             origin: "api",
        //             success: false,
        //             data: {
        //               message:
        //                 "FAILED TO SEND 1 Hour Booking Abandonment Recovery Email Notification",
        //             },
        //             sendToSlack: true,
        //           });
        //         })
        //         .catch(async (error: any) => await throwError(error))
        //   )
        //   .catch(async (error: any) => await throwError(error));
      }
    }
  });
