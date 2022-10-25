import {throwError, admin, DEBUG, functions} from "./../../config/config";
import {parseAsync} from "json2csv";
import {v4 as uuidv4} from "uuid";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export const exportCollectionToCSV = functions.pubsub
  .topic("export-collection-to-csv")
  .onPublish(async (message: any) => {
    if (DEBUG) console.log("message", message);
    const {collection, fields} = message?.attributes || {};
    if (DEBUG) console.log("collection", collection);
    if (DEBUG) console.log("fields", fields);
    const snapshot = await admin
      .firestore()
      .collection(`${message}`)
      .get()
      .catch(async (error: any) => await throwError(error));
    const data = snapshot.docs.map((doc: any) => doc.data());
    if (DEBUG) console.log("data", data);
    const output: any = await parseAsync(data, {
      fields: JSON.parse(fields),
    }).catch(async (error: any) => await throwError(error));
    if (DEBUG) console.log("output", output);
    const dateTime = new Date().toISOString().replace(/\W/g, "");
    const filename = `${collection}_${dateTime}.csv`;
    const tempLocalFile = path.join(os.tmpdir(), filename);
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(tempLocalFile, output, error => {
        if (error) {
          reject(error);
          return;
        }
        const bucket = admin.storage().bucket();
        bucket
          .upload(tempLocalFile, {
            // Workaround: firebase console not generating token for files
            // uploaded via Firebase Admin SDK
            // https://github.com/firebase/firebase-admin-node/issues/694
            metadata: {
              metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
              },
            },
          })
          .then(() => resolve())
          .catch((error: any) => reject(error));
      });
    });
  });
