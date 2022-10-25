import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  DEBUG,
  environment,
  emailClient,
} from "../../config/config";
// import {createAuthClient} from '../../integrations/provet/entities/client/createAuthClient';
import {createProVetClient} from "../../integrations/provet/entities/client/createProVetClient";
import {updateProVetClient} from "../../integrations/provet/entities/client/updateProVetClient";
import {logEvent} from "../../utils/logging/logEvent";
import {recaptchaIsVerified} from "../../utils/recaptchaIsVerified";

interface ContactRequest {
  token: string;
  reason: {id: string; name: string};
  email: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobileAppSignUp?: boolean;
  isApp?: boolean;
}

export const contact = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      token,
      reason,
      email,
      message,
      firstName,
      lastName,
      phone,
      mobileAppSignUp,
      isApp,
    }: ContactRequest): Promise<boolean> => {
      const payload = {
        token,
        reason,
        email,
        message,
        firstName,
        lastName,
        phone,
        mobileAppSignUp,
        isApp,
      };
      if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", payload);

      if (token) {
        if (await recaptchaIsVerified(token)) {
          if (mobileAppSignUp) {
            const proVetClientData: any = await createProVetClient({
              email,
              firstname: firstName || undefined,
              lastname: lastName || undefined,
              zip_code: null,
            });
            if (proVetClientData) {
              await updateProVetClient({
                phone: phone || null,
                id: proVetClientData?.id,
              });
            }
          }
          return await admin
            .firestore()
            .collection("forms")
            .doc("contact")
            .collection(isApp ? "app" : "web")
            .doc(`${new Date().toString()}`)
            .set({
              ...payload,
              createdOn: new Date(),
            })
            .then(async () => {
              if (DEBUG)
                console.log("Successfully Saved New Contact Request", {
                  ...payload,
                  createdOn: new Date(),
                });
              const emailText = `${
                (firstName || lastName) &&
                `<p>Name: ${firstName || "Not Provided"} ${
                  lastName || "Not Provided"
                }</p>`
              }${email && `<p>Email: ${email}</p>`}${
                phone && `<p>Phone: ${phone}</p>`
              }${message && `<p>Message: ${message}</p>`}${
                reason && `<p>Reason: ${reason?.name || reason?.id}</p>`
              }${
                mobileAppSignUp &&
                `<p>Sign Up for Mobile App: ${
                  mobileAppSignUp?.toString() || "No"
                }</p><p>Source: ${isApp ? "Mobile App" : "Website"}</p>`
              }`;

              const emailConfig: any = {
                to: "info@movetcare.com",
                from: "info@movetcare.com",
                bcc: "support@movetcare.com",
                replyTo: email,
                subject: "MoVET Contact Form Submission",
                text: emailText.replace(/(<([^>]+)>)/gi, ""),
                html: emailText,
              };
              if (environment?.type === "production" && message)
                return await emailClient
                  .send(emailConfig)
                  .then(async () => {
                    if (DEBUG) console.log("EMAIL SENT!", emailConfig);
                    return await logEvent({
                      tag: "contact",
                      origin: "api",
                      success: true,
                      data: {
                        reference: `forms/contact/${
                          isApp ? "app" : "web"
                        }/${new Date().toString()}`,
                        message: emailText,
                      },
                      sendToSlack: true,
                    })
                      .then(() => true)
                      .catch(async (error: any) => await throwError(error));
                  })
                  .catch(async (error: any) => await throwError(error));
              else
                return await logEvent({
                  tag: "notification",
                  origin: "api",
                  success: true,
                  data: emailConfig,
                });
            })
            .catch(async (error: any) => await throwError(error));
        } else return false;
      } else return false;
    }
  );
