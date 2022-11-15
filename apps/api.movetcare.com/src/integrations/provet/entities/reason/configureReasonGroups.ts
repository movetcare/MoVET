import {admin, DEBUG, throwError} from "../../../../config/config";
import type { ReasonGroup } from "../../../../types/reason";
import {deleteCollection} from "../../../../utils/deleteCollection";
import {getProVetIdFromUrl} from "../../../../utils/getProVetIdFromUrl";
import {fetchEntity} from "../fetchEntity";

const visibleReasonGroupsInApp = [35, 36, 37];

export const configureReasonGroups = async (): Promise<boolean> => {
  console.log("STARTING REASONS CONFIGURATION");
  await deleteCollection("reason_group").then(
    () => DEBUG && console.log("DELETED ALL REASONS!")
  );
  const reasonGroups: Array<ReasonGroup> = await fetchEntity("reason_group");
  if (reasonGroups) return await saveReasonsData(reasonGroups);
  else return throwError("Failed to Process Reason Groups");
};

const saveReasonsData = async (reasons: Array<ReasonGroup>): Promise<boolean> =>
  await Promise.all(
    reasons.map(
      async (group: any) =>
        await admin
          .firestore()
          .collection("reason_groups")
          .doc(`${group?.id}`)
          .set(
            {
              isVisible: visibleReasonGroupsInApp.includes(group.id),
              id: group?.id,
              name: group?.name,
              department: getProVetIdFromUrl(group.department),
              updatedOn: new Date(),
            } as ReasonGroup,
            { merge: true }
          )
          .then(() => true)
          .catch(async (error: any) => throwError(error))
    )
  )
    .then(async () => true)
    .catch((error: any) => throwError(error));
