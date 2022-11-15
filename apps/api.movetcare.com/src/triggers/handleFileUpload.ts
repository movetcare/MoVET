import { functions } from "../config/config";
import { createProVetNote } from "../integrations/provet/entities/note/createProVetNote";
import { updateCustomField } from "../integrations/provet/entities/patient/updateCustomField";
// import { Storage } from "@google-cloud/storage";
const DEBUG = false;
export const handleFileUpload = functions.storage
  .object()
  .onFinalize((object: any) => {
    const pathParts = object.name.split("/");
    if (DEBUG) {
      console.log("handleFileUpload object", object);
      console.log("handleFileUpload pathParts", pathParts);
    }
    if (pathParts[0] === "clients" && pathParts[3] !== "new") {
      if (pathParts[4] === "records") {
        createProVetNote({
          type: 10,
          subject: "Previous Clinical History Provided by Client",
          message:
            object.mediaLink.includes("127.0.0.1") ||
            object.mediaLink.includes("localhost")
              ? `<a href="${object.mediaLink
                  .replaceAll("127.0.0.1", "movetcare.com")
                  .replaceAll(
                    "localhost",
                    "movetcare.com"
                  )}">Click Here to View PDF (LINK IS BROKEN)</a>`
              : `<a href="${object.mediaLink}">Click Here to View PDF</a>`,
          client: pathParts[1],
          patients: [pathParts[3]],
        });
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
        //         })
        //         .catch(async (error: any) => throwError(error))
        //   )
        //    .catch((error: any) => throwError(error));
      } else if (pathParts[4] === "photo") {
        updateCustomField(
          pathParts[3],
          7,
          object.mediaLink.includes("127.0.0.1") ||
            object.mediaLink.includes("localhost")
            ? object.mediaLink
                .replaceAll("127.0.0.1", "movetcare.com")
                .replaceAll("localhost", "movetcare.com")
            : object.mediaLink
        );
        createProVetNote({
          type: 9,
          subject: "Patient Photo Uploaded by Client",
          message:
            object.mediaLink.includes("127.0.0.1") ||
            object.mediaLink.includes("localhost")
              ? `<a href="${object.mediaLink
                  .replaceAll("127.0.0.1", "movetcare.com")
                  .replaceAll(
                    "localhost",
                    "movetcare.com"
                  )}">Click Here to View PDF (LINK IS BROKEN)</a>`
              : `<a href="${object.mediaLink}">Click Here to View Image</a>`,
          client: pathParts[1],
          patients: [pathParts[3]],
        });
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
        //         })
        //         .catch(async (error: any) => throwError(error))
        //   )
        //    .catch((error: any) => throwError(error));
      }
    }
    return true;
  });
