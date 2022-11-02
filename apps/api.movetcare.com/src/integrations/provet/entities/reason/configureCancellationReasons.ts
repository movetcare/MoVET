import {admin, throwError} from "../../../../config/config";
import type { ReasonGroup } from "../../../../types/reason";
import {fetchEntity} from "../fetchEntity";

export const configureCancellationReasons = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("cancellation_reasons")
    .get()
    .then((document: any) => (document.data() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "configuration/cancellation_reasons/ DOCUMENT DETECTED - SKIPPING APPOINTMENT CANCELLATION OPTIONS CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/cancellation_reasons/ DOCUMENT AND RESTART TO REFRESH THE APPOINTMENT CANCELLATION OPTIONS CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING CANCELLATION REASONS CONFIGURATION");
    const cancellationReasons: Array<ReasonGroup> = await fetchEntity(
      "cancellationreason"
    );
    const activeCancellationReasons: Array<any> = [];
    cancellationReasons.forEach((reason: any) => {
      if (reason.archived === false)
        activeCancellationReasons.push({id: reason.id, title: reason.name});
    });
    if (activeCancellationReasons.length)
      return await saveCancellationReasonsData(activeCancellationReasons);
    else return await throwError("Failed to Process Reason Groups");
  }
};

const saveCancellationReasonsData = async (cancellationReasons: any) =>
  admin
    .firestore()
    .collection("configuration")
    .doc("cancellation_reasons")
    .set(
      {
        record: cancellationReasons,
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(() => true)
    .catch(async (error: any) => await throwError(error));
