import { admin } from "../../config/config";

export const verifyExistingClient = async (
  email: string
): Promise<boolean | null> =>
  admin
    .auth()
    .getUserByEmail(email)
    .then(() => true)
    .catch((error: any) => {
      if (error.code === "auth/user-not-found") {
        return false;
      } else {
        console.log(error);
        return null;
      }
    });
