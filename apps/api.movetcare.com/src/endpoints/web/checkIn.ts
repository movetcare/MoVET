import Stripe from "stripe";
import {
  request,
  functions,
  defaultRuntimeOptions,
  DEBUG,
  throwError,
  admin,
  proVetApiUrl,
  environment,
  stripe,
} from "../../config/config";
import {createAuthClient} from "../../integrations/provet/entities/client/createAuthClient";
import {createProVetClient} from "../../integrations/provet/entities/client/createProVetClient";
import {saveClient} from "../../integrations/provet/entities/client/saveClient";
import {updateProVetClient} from "../../integrations/provet/entities/client/updateProVetClient";
import {logEvent} from "../../utils/logging/logEvent";
import {recaptchaIsVerified} from "../../utils/recaptchaIsVerified";
import {verifyValidPaymentSource} from "../../utils/verifyValidPaymentSource";

export const checkIn = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<any> => {
    if (DEBUG) console.log("INCOMING REQUEST PAYLOAD checkIn => ", data);
    const {token, phone, firstName, lastName, id} = data || {};
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
          const didUpdateProVetClient = await updateProVetClient({
            firstName: firstName || "UNKNOWN",
            lastName: lastName || "UNKNOWN",
            phone: phone || "UNKNOWN",
            id: id,
          });
          const client = await admin
            .firestore()
            .collection("clients")
            .doc(`${id}`)
            .get()
            .then((doc: any) => doc.data())
            .catch(async (error: any) => await throwError(error));
          await stripe.customers
            .update(`${client?.customer?.id}`, {
              name:
                firstName && lastName
                  ? `${firstName} ${lastName}`
                  : firstName
                  ? firstName
                  : lastName
                  ? lastName
                  : null,
              phone: phone || null,
            })
            .catch(async (error: any) => await throwError(error));
          await admin
            .firestore()
            .collection("waitlist")
            .doc(client?.email)
            .set(
              {
                ...data,
                isActive: true,
                updatedOn: new Date(),
              },
              {merge: true}
            );
          if (didUpdateProVetClient)
            return {
              client: {
                email: client?.email,
                firstName: firstName || "",
                lastName: lastName || "",
                phone: phone || "",
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
              await logEvent({
                tag: "checkin",
                origin: "api",
                success: true,
                data: {
                  token,
                  phone,
                  firstName,
                  lastName,
                  id,
                  email,
                  status: "started",
                },
                sendToSlack: true,
              }).catch(async (error: any) => await throwError(error));
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
                await admin
                  .firestore()
                  .collection("waitlist")
                  .doc(email)
                  .set(
                    {
                      status: "creating-client",
                      updatedOn: new Date(),
                    },
                    {merge: true}
                  )
                  .catch(async (error: any) => await throwError(error));
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
                  if (didCreateNewClient) {
                    await admin
                      .firestore()
                      .collection("waitlist")
                      .doc(email)
                      .set(
                        {
                          id: proVetClientData?.id,
                          updatedOn: new Date(),
                        },
                        {merge: true}
                      )
                      .catch(async (error: any) => await throwError(error));
                    if (phone) {
                      if (DEBUG) console.log("SAVING CLIENT PHONE NUMBER");
                      await request
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
                        .then(async (response: any) => {
                          const {data} = response;
                          if (DEBUG)
                            console.log(
                              "API Response: POST /phonenumber/ => ",
                              data
                            );
                        })
                        .catch(async (error: any) => await throwError(error));
                      await admin
                        .firestore()
                        .collection("waitlist")
                        .doc(email)
                        .set(
                          {
                            phone,
                            updatedOn: new Date(),
                          },
                          {merge: true}
                        )
                        .catch(async (error: any) => await throwError(error));
                    }
                    if (DEBUG) console.log("CREATING CUSTOMER");
                    const {data: matchingCustomers} =
                      await stripe.customers.list({
                        email,
                      });
                    if (DEBUG) {
                      console.log("Existing Customers => ", matchingCustomers);
                      console.log(
                        "Number of Existing Customers w/ Same Email",
                        matchingCustomers.length
                      );
                    }
                    let customer: Stripe.Customer | any = null;
                    if (matchingCustomers.length === 0) {
                      if (DEBUG)
                        console.log("Creating NEW Customer: ", {
                          address: {
                            line1: "UNKNOWN - WALK IN",
                            city: "DENVER",
                            state: "CO",
                            country: "US",
                          },
                          email,
                          metadata: {
                            clientId: proVetClientData?.id,
                          },
                        });
                      customer = await stripe.customers
                        .create({
                          address: {
                            line1: "UNKNOWN - WALK IN",
                            city: "DENVER",
                            state: "CO",
                            country: "US",
                          },
                          email,
                          metadata: {
                            clientId: proVetClientData?.id,
                          },
                        })
                        .catch(
                          async (error: any) => (await throwError(error)) as any
                        );
                    } else {
                      let matchedCustomer = null;
                      matchingCustomers.forEach((customerData: any) => {
                        if (
                          customerData.metadata?.clientId ===
                          proVetClientData?.id
                        )
                          matchedCustomer = customerData;
                      });
                      if (matchedCustomer === null) {
                        if (DEBUG)
                          console.log(
                            "No Matching clientIds Found. Creating NEW Customer: ",
                            {
                              address: {
                                line1: "UNKNOWN - WALK IN",
                                city: "DENVER",
                                state: "CO",
                                country: "US",
                              },
                              email,
                              metadata: {
                                clientId: proVetClientData?.id,
                              },
                            }
                          );
                        customer = await stripe.customers
                          .create({
                            address: {
                              line1: "UNKNOWN - WALK IN",
                              city: "DENVER",
                              state: "CO",
                              country: "US",
                            },
                            email,
                            metadata: {
                              clientId: proVetClientData?.id,
                            },
                          })
                          .catch(
                            async (error: any) =>
                              (await throwError(error)) as any
                          );
                      } else {
                        customer = matchedCustomer;
                        if (DEBUG)
                          console.log(
                            "Matched an existing customer ID => ",
                            customer
                          );
                      }
                    }

                    if (DEBUG) console.log("CUSTOMER -> ", customer);
                    await admin
                      .firestore()
                      .collection("waitlist")
                      .doc(email)
                      .set(
                        {
                          status: "checkout",
                          customerId: customer?.id,
                          updatedOn: new Date(),
                        },
                        {merge: true}
                      )
                      .catch(async (error: any) => await throwError(error));
                    const session = await stripe.checkout.sessions.create({
                      payment_method_types: ["card"],
                      mode: "setup",
                      customer: customer?.id,
                      client_reference_id: proVetClientData?.id,
                      metadata: {
                        clientId: proVetClientData?.id,
                      },
                      success_url:
                        (environment?.type === "development"
                          ? "http://localhost:3000"
                          : environment.type === "staging"
                          ? "https://staging.movetcare.com"
                          : "https://movetcare.com") +
                        "/appointment-check-in/success/",
                      cancel_url:
                        (environment?.type === "development"
                          ? "http://localhost:3000"
                          : environment.type === "staging"
                          ? "https://staging.movetcare.com"
                          : "https://movetcare.com") + "/appointment-check-in/",
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
                          .catch(async (error: any) => throwError(error));
                        if (DEBUG)
                          console.log("FINAL RESULT => ", {
                            client: {...client, id: client?.uid},
                            session,
                            isNewClient,
                          });
                        await logEvent({
                          tag: "checkin",
                          origin: "api",
                          success: true,
                          data: {
                            client: {
                              firstName: client?.firstName,
                              lastName: client?.lastName,
                              phone: client?.phone,
                              id: client?.uid,
                              updatedOn: new Date(),
                            },
                            session,
                            isNewClient,
                          },
                          sendToSlack: true,
                        }).catch(async (error: any) => await throwError(error));
                        await admin
                          .firestore()
                          .collection("waitlist")
                          .doc(client?.email)
                          .set(
                            {
                              firstName: client?.firstName,
                              lastName: client?.lastName,
                              phone: client?.phone,
                              id: client?.uid,
                              updatedOn: new Date(),
                            },
                            {merge: true}
                          )
                          .catch(async (error: any) => await throwError(error));
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
                      .catch(async (error: any) => await throwError(error));
                  }
                } else {
                  if (DEBUG)
                    console.log("ERROR: proVetClientData", proVetClientData);
                  await admin
                    .firestore()
                    .collection("waitlist")
                    .doc(email)
                    .set(
                      {status: "error", updatedOn: new Date()},
                      {merge: true}
                    )
                    .catch(async (error: any) => await throwError(error));
                }
              } else {
                if (DEBUG) console.log("HANDLING EXISTING CLIENT CHECK IN");
                await admin
                  .firestore()
                  .collection("waitlist")
                  .doc(email)
                  .set(
                    {
                      status: "processing-client",
                      updatedOn: new Date(),
                    },
                    {merge: true}
                  )
                  .catch(async (error: any) => await throwError(error));
                const clientId = await admin
                  .auth()
                  .getUserByEmail(email)
                  .then((userRecord: any) => {
                    if (DEBUG) console.log("userRecord", userRecord);
                    return userRecord?.uid;
                  })
                  .catch(async (error: any) => throwError(error));
                await admin
                  .firestore()
                  .collection("waitlist")
                  .doc(email)
                  .set(
                    {
                      id: clientId,
                      updatedOn: new Date(),
                    },
                    {merge: true}
                  )
                  .catch(async (error: any) => await throwError(error));
                const client = await admin
                  .firestore()
                  .collection("clients")
                  .doc(clientId)
                  .get()
                  .then((doc: any) => doc.data())
                  .catch(async (error: any) => await throwError(error));
                const {data: matchingCustomers} = await stripe.customers.list({
                  email,
                });
                if (DEBUG) {
                  console.log("client", client);
                  console.log("Existing Customers => ", matchingCustomers);
                  console.log(
                    "Number of Existing Customers w/ Same Email",
                    matchingCustomers.length
                  );
                }
                let customer: Stripe.Customer | any = null;
                if (matchingCustomers.length === 0) {
                  if (DEBUG)
                    console.log("Creating NEW Customer: ", {
                      address: {
                        line1: "UNKNOWN - WALK IN",
                        city: "DENVER",
                        state: "CO",
                        country: "US",
                      },
                      name:
                        client?.firstName && client?.lastName
                          ? `${client?.firstname} ${client?.lastName}`
                          : client?.firstName
                          ? client?.firstName
                          : client?.lastName
                          ? client?.lastName
                          : null,
                      email: client?.email ? client?.email : "UNKNOWN",
                      phone: client?.phone ? client?.phone : "UNKNOWN",
                      metadata: {
                        clientId,
                      },
                    });
                  customer = await stripe.customers
                    .create({
                      address: {
                        line1: "UNKNOWN - WALK IN",
                        city: "DENVER",
                        state: "CO",
                        country: "US",
                      },
                      name:
                        client?.firstName && client?.lastName
                          ? `${client?.firstname} ${client?.lastName}`
                          : client?.firstName
                          ? client?.firstName
                          : client?.lastName
                          ? client?.lastName
                          : null,
                      email: client?.email ? client?.email : "UNKNOWN",
                      phone: client?.phone ? client?.phone : "UNKNOWN",
                      metadata: {
                        clientId,
                      },
                    })
                    .catch(async (error: any) => await throwError(error));
                } else {
                  let matchedCustomer = null;
                  matchingCustomers.forEach((customerData: any) => {
                    if (customerData.metadata?.clientId === clientId)
                      matchedCustomer = customerData;
                  });
                  if (matchedCustomer === null) {
                    if (DEBUG)
                      console.log(
                        "No Matching clientIds Found. Creating NEW Customer: ",
                        {
                          address: {
                            line1: "UNKNOWN - WALK IN",
                            city: "DENVER",
                            state: "CO",
                            country: "US",
                          },
                          name:
                            client?.firstName && client?.lastName
                              ? `${client?.firstname} ${client?.lastName}`
                              : client?.firstName
                              ? client?.firstName
                              : client?.lastName
                              ? client?.lastName
                              : null,
                          email: client?.email ? client?.email : "UNKNOWN",
                          phone: client?.phone ? client?.phone : "UNKNOWN",
                          metadata: {
                            clientId,
                          },
                        }
                      );
                    customer = await stripe.customers
                      .create({
                        address: {
                          line1: "UNKNOWN - WALK IN",
                          city: "DENVER",
                          state: "CO",
                          country: "US",
                        },
                        name:
                          client?.firstName && client?.lastName
                            ? `${client?.firstname} ${client?.lastName}`
                            : client?.firstName
                            ? client?.firstName
                            : client?.lastName
                            ? client?.lastName
                            : null,
                        email: client?.email ? client?.email : "UNKNOWN",
                        phone: client?.phone ? client?.phone : "UNKNOWN",
                        metadata: {
                          clientId,
                        },
                      })
                      .catch(async (error: any) => await throwError(error));
                  } else {
                    customer = matchedCustomer;
                    if (DEBUG)
                      console.log(
                        "Matched an existing customer ID => ",
                        customer
                      );
                  }
                }
                if (DEBUG) console.log("CUSTOMER -> ", customer);
                const paymentMethods =
                  await stripe.customers.listPaymentMethods(customer?.id, {
                    type: "card",
                  });
                const validPaymentMethods = await verifyValidPaymentSource(
                  clientId,
                  customer.id
                );
                if (DEBUG) {
                  console.log("paymentMethods", paymentMethods);
                  console.log("validPaymentMethods", validPaymentMethods);
                }
                if (validPaymentMethods !== false) {
                  await admin
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
                        customerId: customer?.id,
                        paymentMethod: paymentMethods?.data[0],
                        updatedOn: new Date(),
                      },
                      {merge: true}
                    )
                    .catch(async (error: any) => await throwError(error));
                  if (DEBUG)
                    console.log("FINAL RESULT => ", {
                      isNewClient,
                      client,
                    });
                  await logEvent({
                    tag: "checkin",
                    origin: "api",
                    success: true,
                    data: {
                      isNewClient,
                      id: clientId,
                      firstName: client?.firstName,
                      lastName: client?.lastName,
                      phone: client?.phone,
                      status: "complete",
                      isActive: true,
                      customerId: customer?.id,
                      paymentMethod: paymentMethods?.data[0],
                      updatedOn: new Date(),
                    },
                    sendToSlack: true,
                  }).catch(async (error: any) => await throwError(error));
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
                    customer: customer?.id,
                    client_reference_id: clientId,
                    metadata: {
                      clientId,
                    },
                    success_url:
                      (environment?.type === "development"
                        ? "http://localhost:3000"
                        : environment.type === "staging"
                        ? "https://staging.movetcare.com"
                        : "https://movetcare.com") +
                      "/appointment-check-in/success/",
                    cancel_url:
                      (environment?.type === "development"
                        ? "http://localhost:3000"
                        : environment.type === "staging"
                        ? "https://staging.movetcare.com"
                        : "https://movetcare.com") + "/appointment-check-in/",
                  });
                  await admin
                    .firestore()
                    .collection("waitlist")
                    .doc(email)
                    .set(
                      {
                        status: "checkout",
                        id: clientId,
                        firstName: client?.firstName,
                        lastName: client?.lastName,
                        phone: client?.phone,
                        customerId: customer?.id,
                        updatedOn: new Date(),
                      },
                      {merge: true}
                    )
                    .catch(async (error: any) => await throwError(error));
                  if (DEBUG)
                    console.log("FINAL RESULT => ", {
                      session,
                      isNewClient,
                      client: {...client, id: clientId},
                    });
                  await logEvent({
                    tag: "checkin",
                    origin: "api",
                    success: true,
                    data: {
                      client: {
                        status: "checkout",
                        id: clientId,
                        firstName: client?.firstName,
                        lastName: client?.lastName,
                        phone: client?.phone,
                        customerId: customer?.id,
                        updatedOn: new Date(),
                      },
                      session,
                      isNewClient,
                    },
                    sendToSlack: true,
                  }).catch(async (error: any) => await throwError(error));
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
            .catch(async (error: any) => await throwError(error));
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
          .catch(async (error: any) => await throwError(error));
      } else {
        if (DEBUG) console.log("FAILED TO PASS CAPTCHA");
        await logEvent({
          tag: "checkin",
          origin: "api",
          success: false,
          data: {...data, message: "FAILED TO PASS CAPTCHA"},
          sendToSlack: true,
        }).catch(async (error: any) => await throwError(error));
        return false;
      }
    } else {
      if (DEBUG) console.log("MISSING TOKEN");
      await logEvent({
        tag: "checkin",
        origin: "api",
        success: false,
        data: {...data, message: "MISSING TOKEN"},
        sendToSlack: true,
      }).catch(async (error: any) => await throwError(error));
      return false;
    }
  });
