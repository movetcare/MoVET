import {
  functions,
  defaultRuntimeOptions,
  throwError,
  stripe,
  admin,
} from "./../../config/config";
import { Response } from "express";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { saveClient } from "../../integrations/provet/entities/client/saveClient";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import { savePatient } from "../../integrations/provet/entities/patient/savePatient";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
const DEBUG = false;
export const initTestUser: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (request.headers.host === "localhost:5001")
      return (await deleteDefaultUsers()) &&
        (await importDefaultUsers()) &&
        (await importTestUser(
          "dev+test@movetcare.com",
          5769,
          "cus_Prf6RZhu7iELJN",
          "pm_1PtB8eDVQU5TYLF17XZFYzLh",
        )) &&
        (await importTestUser(
          "dev+test_vcpr_not_required@movetcare.com",
          6008,
          "cus_Prf9bWZqSxTbEO",
          "pm_1P1voyDVQU5TYLF1uGxyCVVc",
        )) &&
        (await importTelehealthChat())
        ? response.status(200).send()
        : response.status(500).send();
    else return response.status(400).send();
  });

const deleteDefaultUsers = async () =>
  await admin
    .auth()
    .deleteUsers(["0", "1"])
    .then(async (deleteUsersResult: any) => {
      if (DEBUG) {
        if (deleteUsersResult.successCount > 0)
          console.log(
            `Successfully deleted ${deleteUsersResult.successCount} users`,
            deleteUsersResult,
          );
        if (deleteUsersResult.failureCount > 0)
          console.log(
            `Failed to delete ${deleteUsersResult.failureCount} users`,
            deleteUsersResult,
          );
      }
      if (deleteUsersResult.errors.length > 0) {
        deleteUsersResult.errors.forEach((error: any) => {
          if (DEBUG) console.log(error.error.toJSON());
        });
        return throwError(deleteUsersResult.errors);
      } else return true;
    })
    .catch((error: any) => throwError(error));

const importDefaultUsers = async (): Promise<boolean> =>
  await admin
    .auth()
    .importUsers([
      {
        uid: "0",
        displayName: "Alex",
        email: "alex@movetcare.com",
        emailVerified: true,
        phoneNumber: "+3147360856",
        password: "testing123",
        customClaims: { isSuperAdmin: true, isAdmin: true, isStaff: true },
        providerData: [
          {
            uid: "0",
            email: "alex@movetcare.com",
            displayName: "Alex",
            providerId: "google.com",
          },
        ],
      },
      {
        uid: "1",
        displayName: "Lexi",
        email: "lexi@movetcare.com",
        emailVerified: true,
        customClaims: { isAdmin: true },
        providerData: [
          {
            uid: "1",
            email: "lexi@movetcare.com",
            displayName: "Lexi",
            providerId: "google.com",
          },
        ],
      },
      {
        uid: "2",
        displayName: "MoVET Staff",
        email: "info@movetcare.com",
        emailVerified: true,
        customClaims: { isStaff: true },
        providerData: [
          {
            uid: "2",
            email: "info@movetcare.com",
            displayName: "MoVET Staff",
            providerId: "google.com",
          },
        ],
      },
    ])
    .then(async (results: any) => {
      if (results.errors.length > 0) {
        results.errors.forEach((indexedError: any) => {
          if (DEBUG) {
            console.error(
              `Error importing user ${indexedError.index}`,
              indexedError,
            );
          }
        });
        return throwError(results.errors);
      } else {
        if (DEBUG) {
          if (results.successCount > 0)
            console.log(
              `Successfully imported ${results.successCount} users`,
              results,
            );
          if (results.failureCount > 0)
            console.log(
              `Failed to import ${results.failureCount} users`,
              results,
            );
        }
        return true;
      }
    })
    .catch((error: any) => throwError(error));

const importTestUser = async (
  email: string,
  id: number,
  customer: string,
  paymentMethod: string,
): Promise<boolean> => {
  const proVetClientData = await fetchEntity("client", id);
  let didImportTestUser = false;
  const testUserAlreadyExists = await verifyExistingClient(email);
  if (testUserAlreadyExists === true) {
    if (DEBUG)
      console.log(
        `Test User Already Exists, Updating Firestore Document ID: ${proVetClientData.id}`,
      );
    didImportTestUser = await saveClient(id, proVetClientData, null);
  } else {
    if (DEBUG)
      console.log(
        `Test User Does NOT Exists, Creating New Auth User and Firestore Document for Client: ${proVetClientData.id}`,
        proVetClientData,
      );
    didImportTestUser = await createAuthClient({
      ...proVetClientData,
      email,
      password: "testing",
    });
  }
  await importPatientData(proVetClientData);
  await importCustomerData(
    id,
    await stripe.customers.retrieve(customer).finally(() => true),
  );
  await importCustomerPaymentMethod(id, {
    ...(await stripe.paymentMethods
      .retrieve(paymentMethod)
      .finally(() => true)),
    active: true,
    updatedOn: new Date(),
  }).finally(() => true);
  if (didImportTestUser) return true;
  else
    return throwError(
      `Failed to configure test user ${JSON.stringify({
        email,
        id,
        customer,
        paymentMethod,
      })}`,
    );
};

const importPatientData = async (proVetClientData: any) => {
  const patientIds: any = [];
  proVetClientData.patients.map((patientUrl: string) =>
    patientIds.push(getProVetIdFromUrl(patientUrl)),
  );
  return await Promise.all(
    patientIds.map(async (patientId: string) => {
      const patient = await fetchEntity("patient", parseInt(patientId));
      if (!patient?.archived) await savePatient(patient);
    }),
  )
    .then(() => true)
    .catch((error: any) => throwError(error));
};

const importCustomerData = async (client: number, stripeCustomerData: any) =>
  await admin
    .firestore()
    .collection("clients")
    .doc(`${client}`)
    .set(
      {
        customer: stripeCustomerData.id,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .catch((error: any) => throwError(error));

const importCustomerPaymentMethod = async (
  client: number,
  paymentMethod: any,
) =>
  await admin
    .firestore()
    .collection("clients")
    .doc(`${client}`)
    .collection("payment_methods")
    .doc(`${paymentMethod?.id}`)
    .set({ ...paymentMethod, active: true }, { merge: true })
    .catch((error: any) => throwError(error));

const importTelehealthChat = async () =>
  await admin
    .firestore()
    .collection("telehealth_chat")
    .doc("5769")
    .set(
      {
        client: await admin
          .firestore()
          .collection("clients")
          .doc("5769")
          .get()
          .then((doc: any) => doc?.data()),
        question: "This is a test question...",
        status: "active",
        lastSlackThread: "12345",
        createdAt: new Date(),
      },
      { merge: true },
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("telehealth_chat")
          .doc("5769")
          .collection("log")
          .add({
            _id: "123",
            startNewThread: true,
            text: "This is a test question...",
            user: {
              _id: "5769",
              avatar: null,
              name: null,
            },
            createdAt: new Date(),
          })
          .catch((error: any) => throwError(error)),
    )
    .catch((error: any) => throwError(error));
