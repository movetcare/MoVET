import {UserRecord} from "firebase-admin/lib/auth/user-record";
import { functions, admin, throwError, DEBUG } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";

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
      .catch((error: any) => throwError(error));
    if (DEBUG) console.log("ADMIN USERS => ", adminUsers);
    let isMoVETStaff = false;
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach(
        (
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
            assignMoVETStaffRoles({
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
              async (provider: { providerId: string }) => {
                if (
                  provider?.providerId === "google.com" ||
                  provider?.providerId === "phone"
                ) {
                  disableAuthAccount(user);
                }
              }
            );
        }
      );
    } else if (user?.providerData && user?.providerData.length > 0)
      user?.providerData.forEach((provider: { providerId: string }) => {
        if (DEBUG)
          if (
            provider?.providerId === "google.com" ||
            provider?.providerId === "password" ||
            provider?.providerId === "phone"
          ) {
            disableAuthAccount(user);
          }
      });
    return null;
  });

const disableAuthAccount = (user: UserRecord): void => {
  admin
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
    .then(() =>
      sendNotification({
        type: "slack",
        payload: {
          message: `:interrobang: ADMIN APP ACCESS FAILED!\n\nEmail: ${
            user?.email
          }\n\nPhone: ${user?.phoneNumber}\n\nProvider: ${JSON.stringify(
            user?.providerData
          )}`,
        },
      })
    )
    .catch((error: any) => throwError(error));
};

const assignMoVETStaffRoles = ({
  user,
  adminUser,
}: {
  user: UserRecord;
  adminUser: {
    id: string;
    roles: Array<"superAdmin" | "admin" | "staff">;
  };
}): void => {
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
  admin
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
    .then(() =>
      sendNotification({
        type: "slack",
        payload: {
          message: `:white_check_mark: ADMIN APP ACCESS GRANTED!\n\nEmail: ${
            user?.email
          }\n\nPhone: ${user?.phoneNumber}\n\nProvider: ${JSON.stringify(
            user?.providerData
          )}\n\nRoles: ${JSON.stringify(userRoles)}`,
        },
      })
    )
    .catch((error: any) => throwError(error));
};
