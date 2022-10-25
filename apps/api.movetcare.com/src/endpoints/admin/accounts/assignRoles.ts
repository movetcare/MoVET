import {UserRecord} from "firebase-admin/lib/auth/user-record";
import {functions, admin, throwError, DEBUG} from "../../../config/config";
import {logEvent} from "../../../utils/logging/logEvent";

export const assignRoles = functions.auth
  .user()
  .onCreate(async (user: UserRecord) => {
    const adminUsers = await admin
      .firestore()
      .collection("admins")
      .get()
      .then((snapshot: any) => {
        const admins: Array<any> = [];
        snapshot.forEach((doc: any) => {
          admins.push(doc.data());
        });
        return admins;
      })
      .catch(async (error: any) => await throwError(error));
    if (DEBUG) console.log("ADMIN USERS => ", adminUsers);
    let isMoVETStaff = false;
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach(
        async (
          adminUser: {
            id: string;
            roles: Array<"superAdmin" | "admin" | "staff">;
          },
          index: number
        ) => {
          if (DEBUG)
            console.log(
              `CHECKING IF USER (${
                user?.email || user?.phoneNumber
              }) SHOULD BE ADMIN => `
            );
          if (
            (adminUser?.id === user?.email && user?.emailVerified) ||
            adminUser?.id === user?.phoneNumber?.replace("+1", "")
          ) {
            isMoVETStaff = true;
            await assignMoVETStaffRoles({
              user,
              adminUser,
            });
          }
          if (
            index === adminUsers.length - 1 &&
            isMoVETStaff === false &&
            user?.providerData &&
            user?.providerData.length > 0
          )
            user?.providerData.forEach(
              async (provider: {providerId: string}) => {
                if (
                  provider?.providerId === "google.com" ||
                  provider?.providerId === "phone"
                ) {
                  await disableAuthAccount(user);
                }
              }
            );
        }
      );
    } else if (user?.providerData && user?.providerData.length > 0)
      user?.providerData.forEach(async (provider: {providerId: string}) => {
        if (DEBUG)
          if (
            provider?.providerId === "google.com" ||
            provider?.providerId === "password" ||
            provider?.providerId === "phone"
          ) {
            await disableAuthAccount(user);
          }
      });
    return null;
  });

const disableAuthAccount = async (user: UserRecord) => {
  await admin
    .auth()
    .updateUser(user?.uid, {
      disabled: true,
    })
    .then(
      () =>
        DEBUG &&
        console.log(
          `DISABLED "${user?.email || user?.phoneNumber}" AUTH ACCOUNT!`
        )
    )
    .then(
      async () =>
        await logEvent({
          tag: "create-admin-error",
          origin: "api",
          success: true,
          data: {
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            provider: user?.providerData,
          },
          sendToSlack: true,
        })
    )
    .catch(async (error: any) => await throwError(error));
};

const assignMoVETStaffRoles = async ({
  user,
  adminUser,
}: {
  user: UserRecord;
  adminUser: {
    id: string;
    roles: Array<"superAdmin" | "admin" | "staff">;
  };
}): Promise<void> => {
  if (DEBUG) console.log(`ADMIN MATCH FOR ${adminUser?.id})!`);
  const userRoles: any = {};
  adminUser?.roles?.forEach((role: string) => {
    switch (role) {
      case "superAdmin":
        userRoles.isSuperAdmin = true;
        break;
      case "admin":
        userRoles.isAdmin = true;
        break;
      case "staff":
        userRoles.isStaff = true;
        break;
      default:
        break;
    }
  });
  if (DEBUG) console.log("ROLES MATCHED =>", userRoles);
  await admin
    .auth()
    .setCustomUserClaims(user?.uid, userRoles)
    .then(
      async () =>
        DEBUG &&
        console.log(
          `ADDED ${JSON.stringify(userRoles)} CLAIM TO ${
            user?.email || user?.phoneNumber
          }`
        )
    )
    .then(
      async () =>
        await logEvent({
          tag: "create-admin",
          origin: "api",
          success: true,
          data: {
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            provider: user?.providerData,
            roles: userRoles,
          },
          sendToSlack: true,
        })
          .then(
            () =>
              DEBUG &&
              console.log(
                `SUCCESSFULLY PROMOTED ${
                  user?.email || user?.phoneNumber
                } TO MOVET STAFF!`
              )
          )
          .catch(async (error: any) => await throwError(error))
    )
    .catch(async (error: any) => await throwError(error));
};
