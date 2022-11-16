import { environment, throwError, DEBUG } from "../config/config";
import { Storage } from "@google-cloud/storage";

export const moveFile = (srcFileName: string, destFileName: string) => {
  const bucketName =
    environment.type === "production"
      ? "gs://movet-care.appspot.com"
      : "gs://movet-care-staging.appspot.com";
  if (DEBUG) {
    console.log("moveFile srcFileName", srcFileName);
    console.log("moveFile destFileName", destFileName);
    console.log("moveFile bucketName", bucketName);
  }
  const storage = new Storage();
  storage
    .bucket(bucketName)
    .file(srcFileName)
    .move(destFileName)
    .then(
      () =>
        DEBUG &&
        console.log(
          `gs://${bucketName}/${srcFileName} moved to gs://${bucketName}/${destFileName}`
        )
    )
    .catch((error: any) => throwError(error));
};
