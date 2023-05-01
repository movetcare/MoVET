import { DEBUG, admin, throwError } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";

interface Resource {
  id: number;
  name: string;
  isActive: boolean;
  updatedOn: any;
  department: number;
}
export const configureResources = async (): Promise<boolean> => {
  console.log("STARTING RESOURCES CONFIGURATION");
  const proVetResources: Array<any> = await fetchEntity("resource");
  const resources: any = proVetResources.map((resource: any) => {
    return {
      isActive: resource?.is_active,
      id: resource?.id,
      name: resource?.name,
      department: getProVetIdFromUrl(resource.department),
      updatedOn: new Date(),
    } as Resource;
  });
  if (DEBUG) {
    console.log("proVetResources", proVetResources);
    console.log("resources", resources);
  }
  if (resources)
    return await admin
      .firestore()
      .collection("configuration")
      .doc("resources")
      .set(
        {
          resources,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(() => true)
      .catch((error: any) => throwError(error));
  else return throwError("Failed to Process Resources");
};
