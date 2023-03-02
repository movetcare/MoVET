import {
  request,
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  proVetApiUrl,
  environment,
  stripe,
} from "../../config/config";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";
import { saveClient } from "../../integrations/provet/entities/client/saveClient";
import { updateProVetClient } from "../../integrations/provet/entities/client/updateProVetClient";
import { sendNotification } from "../../notifications/sendNotification";
import { getCustomerId } from "../../utils/getCustomerId";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
const DEBUG = false; // environment.type === "production";
export const checkIn = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<any> => {
    if (DEBUG) console.log("INCOMING REQUEST PAYLOAD checkIn => ", data);
    const { token, phone, firstName, lastName, id } = data || {};
    const email = data?.email?.toLowerCase();
    if (DEBUG) console.log("EMAIL ADDRESS", email);
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (id) {
          if (DEBUG)
            console.log("UPDATING EXISTING CLIENT RECORDS", {
              id,
              phone,
              firstName,
              lastName,
            });
          let didUpdateProVetClient = false;
          if (firstName && lastName && phone && id)
            didUpdateProVetClient = await updateProVetClient({
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              id: id,
            });
          const client = await admin
            .firestore()
            .collection("clients")
            .doc(`${id}`)
            .get()
            .then((doc: any) => doc.data())
            .catch((error: any) => throwError(error));
          // admin
          //   .firestore()
          //   .collection("waitlist")
          //   .doc(client?.email)
          //   .set(
          //     {
          //       ...data,
          //       isActive: true,
          //       updatedOn: new Date(),
          //     },
          //     { merge: true }
          //   );
          if (DEBUG)
            console.log("didUpdateProVetClient", didUpdateProVetClient);
          if (didUpdateProVetClient)
            return {
              client: {
                email: client?.email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                id: id,
              },
            };
          else return false;
        } else {
          const existingCheckIns = await admin
            .firestore()
            .collection("waitlist")
            .where("email", "==", email)
            .get()
            .catch((error: any) => DEBUG && console.log(error));
          existingCheckIns.forEach((checkin: any) => checkin.ref.delete());
          return await admin
            .firestore()
            .collection("waitlist")
            .doc(email)
            .set({
              ...data,
              email,
              status: "started",
              isActive: true,
              updatedOn: new Date(),
            })
            .then(async () => {
              sendNotification({
                type: "slack",
                payload: {
                  message: `:ballot_box_with_check: Appointment Check In Update - Status: Started - ${
                    email ? email : ""
                  } ${firstName ? firstName : ""} ${lastName ? lastName : ""} `,
                },
              });
            })
            .then(async () => {
              if (DEBUG)
                console.log("CHECKING FOR EXISTING CLIENTS WITH EMAIL", email);
              const isNewClient = await admin
                .auth()
                .getUserByEmail(email)
                .then((userRecord: any) => {
                  if (DEBUG) console.log(userRecord);
                  return false;
                })
                .catch((error: any) => {
                  if (DEBUG) console.log(error.code);
                  if (error.code === "auth/user-not-found") return true;
                  else return false;
                });
              if (DEBUG) console.log("isNewClient", isNewClient);
              if (isNewClient) {
                // admin
                //   .firestore()
                //   .collection("waitlist")
                //   .doc(email)
                //   .set(
                //     {
                //       status: "creating-client",
                //       updatedOn: new Date(),
                //     },
                //     { merge: true }
                //   )
                //   .catch((error: any) => throwError(error));
                if (DEBUG) console.log("CREATING NEW CLIENT");
                const proVetClientData: any = await createProVetClient({
                  email,
                  zip_code: null,
                  firstname: firstName,
                  lastname: lastName,
                });
                if (DEBUG) console.log("proVetClientData", proVetClientData);
                if (proVetClientData) {
                  const didCreateNewClient = await createAuthClient(
                    proVetClientData,
                    null,
                    false
                  );
                  if (DEBUG)
                    console.log("didCreateNewClient", didCreateNewClient);
                  if (didCreateNewClient) {
                    // admin
                    //   .firestore()
                    //   .collection("waitlist")
                    //   .doc(email)
                    //   .set(
                    //     {
                    //       id: proVetClientData?.id,
                    //       updatedOn: new Date(),
                    //     },
                    //     { merge: true }
                    //   )
                    //   .catch((error: any) => throwError(error));
                    if (phone) {
                      if (DEBUG) console.log("SAVING CLIENT PHONE NUMBER");
                      request
                        .post("/phonenumber/", {
                          client: `${proVetApiUrl}/client/${proVetClientData?.id}/`,
                          type_code: 1,
                          phone_number: `+1${(phone as string)
                            .replace("-", "")
                            .replace("(", "")
                            .replace(")", "")}`,
                          preferred_reminders: true,
                          description:
                            "Default Phone Number - Used for SMS Alerts",
                        })
                        .then((response: any) => {
                          const { data } = response;
                          if (DEBUG)
                            console.log(
                              "API Response: POST /phonenumber/ => ",
                              data
                            );
                        })
                        .catch((error: any) => throwError(error));
                      // admin
                      //   .firestore()
                      //   .collection("waitlist")
                      //   .doc(email)
                      //   .set(
                      //     {
                      //       phone,
                      //       updatedOn: new Date(),
                      //     },
                      //     { merge: true }
                      //   )
                      //   .catch((error: any) => throwError(error));
                    }
                    const customer = await getCustomerId(
                      `${proVetClientData?.id}`
                    );
                    // admin
                    //   .firestore()
                    //   .collection("waitlist")
                    //   .doc(email)
                    //   .set(
                    //     {
                    //       status: "checkout",
                    //       customerId: customer,
                    //       updatedOn: new Date(),
                    //     },
                    //     { merge: true }
                    //   )
                    //   .catch((error: any) => throwError(error));
                    const session = await stripe.checkout.sessions.create({
                      payment_method_types: ["card"],
                      mode: "setup",
                      customer,
                      client_reference_id: proVetClientData?.id,
                      metadata: {
                        clientId: proVetClientData?.id,
                      },
                      success_url:
                        (environment?.type === "development"
                          ? "http://localhost:3001"
                          : environment.type === "staging"
                          ? "https://stage.app.movetcare.com"
                          : "https://app.movetcare.com") +
                        "/appointment-check-in/success/",
                      cancel_url:
                        (environment?.type === "development"
                          ? "http://localhost:3001"
                          : environment.type === "staging"
                          ? "https://stage.app.movetcare.com"
                          : "https://app.movetcare.com") +
                        "/appointment-check-in/",
                    });

                    return await saveClient(proVetClientData?.id, null, {
                      customer,
                      session,
                    })
                      .then(async () => {
                        if (DEBUG)
                          console.log("Updated Client Document:", {
                            customer,
                          });
                        const client = await admin
                          .auth()
                          .getUserByEmail(email)
                          .then((userRecord: any) => {
                            if (DEBUG) console.log("userRecord", userRecord);
                            return userRecord;
                          })
                          .catch((error: any) => throwError(error));
                        if (DEBUG)
                          console.log("FINAL RESULT => ", {
                            client: { ...client, id: client?.uid },
                            session,
                            isNewClient,
                          });
                        sendNotification({
                          type: "slack",
                          payload: {
                            message: `:ballot_box_with_check: Appointment Check In Update - Status: Client Info - ${
                              email ? email : ""
                            } ${firstName ? firstName : ""} ${
                              lastName ? lastName : ""
                            } `,
                          },
                        });
                        // admin
                        //   .firestore()
                        //   .collection("waitlist")
                        //   .doc(client?.email)
                        //   .set(
                        //     {
                        //       firstName: client?.firstName,
                        //       lastName: client?.lastName,
                        //       phone: client?.phone,
                        //       id: client?.uid,
                        //       updatedOn: new Date(),
                        //     },
                        //     { merge: true }
                        //   )
                        //   .catch((error: any) => throwError(error));
                        return {
                          client: {
                            email: client?.email,
                            firstName: client?.firstName,
                            lastName: client?.lastName,
                            phone: client?.phone,
                            id: client?.uid,
                          },
                          session,
                          isNewClient,
                        };
                      })
                      .catch((error: any) => throwError(error));
                  }
                } else {
                  if (DEBUG)
                    console.log("ERROR: proVetClientData", proVetClientData);
                  admin
                    .firestore()
                    .collection("waitlist")
                    .doc(email)
                    .set(
                      { status: "error", updatedOn: new Date() },
                      { merge: true }
                    )
                    .catch((error: any) => throwError(error));
                }
              } else {
                if (DEBUG) console.log("HANDLING EXISTING CLIENT CHECK IN");
                // admin
                //   .firestore()
                //   .collection("waitlist")
                //   .doc(email)
                //   .set(
                //     {
                //       status: "processing-client",
                //       updatedOn: new Date(),
                //     },
                //     { merge: true }
                //   )
                //   .catch((error: any) => throwError(error));
                const clientId = await admin
                  .auth()
                  .getUserByEmail(email)
                  .then((userRecord: any) => {
                    if (DEBUG) console.log("userRecord", userRecord);
                    return userRecord?.uid;
                  })
                  .catch((error: any) => throwError(error));
                // admin
                //   .firestore()
                //   .collection("waitlist")
                //   .doc(email)
                //   .set(
                //     {
                //       id: clientId,
                //       updatedOn: new Date(),
                //     },
                //     { merge: true }
                //   )
                //   .catch((error: any) => throwError(error));
                const client = await admin
                  .firestore()
                  .collection("clients")
                  .doc(clientId)
                  .get()
                  .then((doc: any) => doc.data())
                  .catch((error: any) => throwError(error));

                if (DEBUG) {
                  console.log("client", client);
                }
                const customer = await getCustomerId(clientId);
                if (DEBUG) console.log("CUSTOMER -> ", customer);
                const paymentMethods =
                  await stripe.customers.listPaymentMethods(customer, {
                    type: "card",
                  });
                const validPaymentMethods = await verifyValidPaymentSource(
                  clientId,
                  customer
                );
                if (DEBUG) {
                  console.log("paymentMethods", paymentMethods);
                  console.log("validPaymentMethods", validPaymentMethods);
                }
                if (validPaymentMethods !== false) {
                  admin
                    .firestore()
                    .collection("waitlist")
                    .doc(email)
                    .set(
                      {
                        id: clientId,
                        firstName: client?.firstName,
                        lastName: client?.lastName,
                        phone: client?.phone,
                        status: "complete",
                        isActive: true,
                        customerId: customer,
                        paymentMethod: paymentMethods?.data[0],
                        updatedOn: new Date(),
                      },
                      { merge: true }
                    )
                    .catch((error: any) => throwError(error));
                  if (DEBUG)
                    console.log("FINAL RESULT => ", {
                      isNewClient,
                      client,
                    });
                  sendNotification({
                    type: "slack",
                    payload: {
                      message: `:ballot_box_with_check: Appointment Check In Update - Status: Complete - ${
                        email ? email : ""
                      } ${firstName ? firstName : ""} ${
                        lastName ? lastName : ""
                      } `,
                    },
                  });
                  return {
                    isNewClient,
                    client: {
                      email: client?.email,
                      firstName: client?.firstName,
                      lastName: client?.lastName,
                      phone: client?.phone,
                      id: clientId,
                    },
                  };
                } else {
                  if (DEBUG)
                    console.log(
                      "NO VALID PAYMENT METHODS FOUND FOR EXISTING CUSTOMER - STARTING NEW CHECKOUT SESSION"
                    );
                  const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "setup",
                    customer,
                    client_reference_id: clientId,
                    metadata: {
                      clientId,
                    },
                    success_url:
                      (environment?.type === "development"
                        ? "http://localhost:3001"
                        : environment.type === "staging"
                        ? "https://stage.app.movetcare.com"
                        : "https://app.movetcare.com") +
                      "/appointment-check-in/success/",
                    cancel_url:
                      (environment?.type === "development"
                        ? "http://localhost:3001"
                        : environment.type === "staging"
                        ? "https://stage.app.movetcare.com"
                        : "https://app.movetcare.com") +
                      "/appointment-check-in/",
                  });
                  // admin
                  //   .firestore()
                  //   .collection("waitlist")
                  //   .doc(email)
                  //   .set(
                  //     {
                  //       status: "checkout",
                  //       id: clientId,
                  //       firstName: client?.firstName,
                  //       lastName: client?.lastName,
                  //       phone: client?.phone,
                  //       customerId: customer,
                  //       updatedOn: new Date(),
                  //     },
                  //     { merge: true }
                  //   )
                  //   .catch((error: any) => throwError(error));
                  if (DEBUG)
                    console.log("FINAL RESULT => ", {
                      session,
                      isNewClient,
                      client: { ...client, id: clientId },
                    });
                  sendNotification({
                    type: "slack",
                    payload: {
                      message: `:ballot_box_with_check: Appointment Check In Update - Status: Checkout - ${
                        email ? email : ""
                      } ${firstName ? firstName : ""} ${
                        lastName ? lastName : ""
                      } `,
                    },
                  });
                  return {
                    session,
                    isNewClient,
                    client: {
                      email: client?.email,
                      firstName: client?.firstName,
                      lastName: client?.lastName,
                      phone: client?.phone,
                      id: clientId,
                    },
                  };
                }
              }
              return false;
            })
            .catch((error: any) => throwError(error));
        }
      } else if (id) {
        if (DEBUG) console.log("FETCHING EXISTING CLIENT RECORDS", id);
        return await admin
          .firestore()
          .collection("clients")
          .doc(`${id}`)
          .get()
          .then((doc: any) => {
            return {
              email: doc.data()?.email,
              firstName: doc.data()?.firstName,
              lastName: doc.data()?.lastName,
              phone: doc.data()?.phone,
            };
          })
          .catch((error: any) => throwError(error));
      } else {
        if (DEBUG) console.log("FAILED TO PASS CAPTCHA");
        sendNotification({
          type: "slack",
          payload: {
            message: `:ballot_box_with_check: Appointment Check In Update - Status: FAILED TO PASS CAPTCHA - ${
              email ? email : ""
            } ${firstName ? firstName : ""} ${lastName ? lastName : ""} `,
          },
        });
        return false;
      }
    } else {
      if (DEBUG) console.log("MISSING TOKEN");
      sendNotification({
        type: "slack",
        payload: {
          message: `:ballot_box_with_check: Appointment Check In Update - Status: MISSING TOKEN - ${
            email ? email : ""
          } ${firstName ? firstName : ""} ${lastName ? lastName : ""} `,
        },
      });
      return false;
    }
  });
