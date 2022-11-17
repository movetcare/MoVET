import { sendNotification } from "./../../../../notifications/sendNotification";
import Stripe from "stripe";
import { admin, stripe, throwError, DEBUG } from "../../../../config/config";
import { sendWelcomeEmail } from "../../../../notifications/templates/sendWelcomeEmail";
import { getAuthUserById } from "../../../../utils/auth/getAuthUserById";
import { fetchEntity } from "../fetchEntity";
import { updateProVetClient } from "./updateProVetClient";

export const createNewClientTask = async (options: {
  clientId: number;
}): Promise<void> => {
  const { clientId } = options;
  if (clientId) {
    const client = await fetchEntity("client", clientId);
    if (client && client?.email) {
      if (DEBUG)
        console.log(
          `CREATING NEW FIREBASE AUTH USER FOR CLIENT #${String(clientId)} - ${
            client?.email
          }`
        );
      admin
        .auth()
        .createUser({
          email: client?.email?.toLowerCase(),
          emailVerified: false,
          uid: String(clientId),
        })
        .then(async (userRecord: any) => {
          if (DEBUG)
            console.log("SUCCESSFULLY CREATED NEW USER => ", userRecord);
          sendWelcomeEmail(userRecord?.email, true);
          createNewCustomer(userRecord);
        })
        .then(() =>
          sendNotification({
            type: "slack",
            payload: {
              message: `:person_in_lotus_position: SUCCESSFULLY CREATED NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}!`,
            },
          })
        )
        .catch(async (error: any) => {
          if (DEBUG) console.log("ERROR", error);
          if (error.code === "auth/uid-already-exists") {
            if (DEBUG)
              console.log(`${client?.email} IS ALREADY A FIREBASE AUTH USER!`);
            const authUser = await getAuthUserById(`${clientId}`);
            createNewCustomer(authUser);
            sendNotification({
              type: "slack",
              payload: {
                message: `:person_in_lotus_position: SUCCESSFULLY CREATED NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}!`,
              },
            });
            sendNotification({
              type: "slack",
              payload: {
                message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: CLIENT ALREADY HAS A FIREBASE AUTH USER!`,
              },
            });
          }
        });
    } else {
      if (DEBUG)
        console.log(
          "createNewClientTask FAILED! UNABLE TO FIND CLIENT`s EMAIL ADDRESS IN PROVET"
        );
      sendNotification({
        type: "slack",
        payload: {
          message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: UNABLE TO FIND CLIENT's EMAIL ADDRESS IN PROVET`,
        },
      });
    }
  } else {
    if (DEBUG) console.log("createNewClientTask FAILED! NO CLIENT ID PROVIDED");
    sendNotification({
      type: "slack",
      payload: {
        message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: CLIENT ALREADY HAS A FIREBASE AUTH USER!`,
      },
    });
  }
};

const createNewCustomer = async (user: any) => {
  const client = await admin
    .firestore()
    .collection("clients")
    .doc(user?.uid)
    .get()
    .then((document: any) => document.data())
    .catch((error: any) => throwError(error));

  const { data: matchingCustomers } = await stripe.customers.list({
    email: user?.email,
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
          line1: client?.street,
          city: client?.city,
          state: client?.state,
          postal_code: client?.zipCode,
          country: "US",
        },
        name:
          client?.firstName && client?.lastName
            ? `${client?.firstName} ${client?.lastName}`
            : client?.firstName
            ? client?.firstName
            : client?.lastName
            ? client?.lastName
            : null,
        email: user?.email,
        phone: user?.phoneNumber,
        metadata: {
          clientId: user?.uid,
        },
      });
    customer = await stripe.customers
      .create({
        address: {
          line1: client?.street,
          city: client?.city,
          state: client?.state,
          postal_code: client?.zipCode,
          country: "US",
        },
        name:
          client?.firstName && client?.lastName
            ? `${client?.firstName} ${client?.lastName}`
            : client?.firstName
            ? client?.firstName
            : client?.lastName
            ? client?.lastName
            : null,
        email: user?.email,
        phone: user?.phoneNumber,
        metadata: {
          clientId: user?.uid,
        },
      })
      .then(() =>
        sendNotification({
          type: "slack",
          payload: {
            message: `:ok_hand: Created New Stripe Customer\n\n${JSON.stringify(
              customer
            )}`,
          },
        })
      )
      .catch((error: any) => throwError(error) as any);
  } else {
    let matchedCustomer = null;
    matchingCustomers.forEach((customerData: any) => {
      if (DEBUG)
        console.log(
          `customer.metadata?.clientId (${customerData.metadata?.clientId}) === user?.uid  (${user?.uid}) `,
          customerData.metadata?.clientId === user?.uid
        );
      if (customerData.metadata?.clientId === user?.uid)
        matchedCustomer = customerData;
    });
    if (matchedCustomer === null) {
      if (DEBUG)
        console.log("No Matching clientIds Found. Creating NEW Customer: ", {
          address: {
            line1: client?.street,
            city: client?.city,
            state: client?.state,
            postal_code: client?.zipCode,
            country: "US",
          },
          name: `${client?.firstName} ${client?.lastName}`,
          email: user?.email,
          phone: user?.phoneNumber,
          metadata: {
            clientId: user?.uid,
          },
        });
      customer = await stripe.customers
        .create({
          address: {
            line1: client?.street,
            city: client?.city,
            state: client?.state,
            postal_code: client?.zipCode,
            country: "US",
          },
          name: `${client?.firstName} ${client?.lastName}`,
          email: user?.email,
          phone: user?.phoneNumber,
          metadata: {
            clientId: user?.uid,
          },
        })
        .then((client: any) =>
          sendNotification({
            type: "slack",
            payload: {
              message: `:ok_hand: Created New Stripe Customer\n\n${JSON.stringify(
                { customer, client }
              )}`,
            },
          })
        )
        .catch((error: any) => throwError(error) as any);
    } else {
      customer = matchedCustomer;
      if (DEBUG) console.log("Matched an existing customer ID => ", customer);
      sendNotification({
        type: "slack",
        payload: {
          message: `:ok_hand: Existing Stripe Customer Found: \n\n${JSON.stringify(
            { customer, client }
          )}`,
        },
      });
    }
  }

  if (DEBUG) console.log("CUSTOMER -> ", customer);

  updateProVetClient({
    customer: customer?.id,
    id: user?.uid,
  });
};
