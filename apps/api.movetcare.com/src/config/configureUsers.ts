import { configureProVetUsers } from "../integrations/provet/entities/user/configureProVetUsers";
import { admin, throwError, DEBUG } from "./config";

export const configureUsers = async (): Promise<boolean> => {
  const alreadyHasUserConfiguration = await admin
    .firestore()
    .collection("users")
    .limit(1)
    .get()
    .then((documents: any) => documents.size);
  const alreadyHasAdminConfiguration = await admin
    .firestore()
    .collection("admins")
    .limit(1)
    .get()
    .then((documents: any) => documents.size);

  if (alreadyHasUserConfiguration === 1 && alreadyHasAdminConfiguration === 1) {
    console.log("users/ COLLECTION DETECTED - SKIPPING ADMIN CONFIGURATION...");
    console.log(
      "DELETE THE configuration/ COLLECTION AND RESTART TO REFRESH THE ADMIN CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING PROVET USER SYNC");
     configureProVetUsers();
    const users = [
      {
        id: "alex.rodriguez@movetcare.com",
        roles: ["superAdmin"],
      },
      {
        id: "lexi.abramson@movetcare.com",
        roles: ["admin"],
      },
      {
        id: "info@movetcare.com",
        roles: ["staff"],
      },
      {
        id: "3147360856",
        roles: ["staff"],
      },
    ];
    console.log("STARTING USER CONFIGURATION FOR ADMIN APP");
    return await Promise.all(
      users.map(
        async (user: any) =>
          await admin
            .firestore()
            .collection("admins")
            .doc(`${user.id}`)
            .set(
              {
                ...user,
                updatedOn: new Date(),
              },
              { merge: true }
            )
            .then(async () => {
              if (DEBUG) console.log("NEW ADMIN USER CONFIGURED => ", user);
              return true;
            })
            .catch((error: any) => throwError(error))
      )
    )
      .then(() => true)
      .catch((error: any) => throwError(error));
  }
};
