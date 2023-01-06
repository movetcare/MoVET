import {
  environment,
  recaptchaSecretKey,
  request,
  throwError,
  DEBUG,
} from "../config/config";

export const recaptchaIsVerified = async (token: string) =>
  environment.type === "development"
    ? true
    : await request
        .post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`
        )
        .then(async (response: any) => {
          const { data } = response;
          if (DEBUG)
            console.log(
              `API RESPONSE: https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token} =>`,
              data
            );
          return data?.success;
        })
        .catch((error: any) => throwError(error));
