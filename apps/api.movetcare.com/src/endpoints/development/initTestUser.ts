import {
  functions,
  defaultRuntimeOptions,
  throwError,
  DEBUG,
  stripe,
  admin,
} from "./../../config/config";
import {Response} from "express";
import {createAuthClient} from "../../integrations/provet/entities/client/createAuthClient";
import {saveClient} from "../../integrations/provet/entities/client/saveClient";
import {fetchEntity} from "../../integrations/provet/entities/fetchEntity";
import {savePatient} from "../../integrations/provet/entities/patient/savePatient";
import {verifyExistingClient} from "../../utils/auth/verifyExistingClient";
import {getProVetIdFromUrl} from "../../utils/getProVetIdFromUrl";

let didImportTestUser = false;
let proVetClientData: any = null;

export const initTestUser: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (request.headers.host === "localhost:5001") {
      await deleteDefaultUsers();
      proVetClientData = await fetchEntity("client", 5125);
      return (await importDefaultUsers()) &&
        (await importTestUser("alex.rodriguez+test@movetcare.com")) &&
        (await importPatientData()) &&
        (await importCustomerData(
          await stripe.customers
            .retrieve("cus_LYg1C7Et5ySQKC")
            .finally(() => true)
        )) &&
        (await importCustomerPaymentMethod({
          ...(await stripe.paymentMethods
            .retrieve("pm_1KrYgADVQU5TYLF15o8YdFox")
            .finally(() => true)),
          active: true,
          updatedOn: new Date(),
        }).finally(() => true)) &&
        (await importTelehealthChat()) &&
        (await importCheckIn())
        ? response.status(200).send()
        : response.status(500).send();
    }
    return response.status(400).send();
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
            deleteUsersResult
          );
        if (deleteUsersResult.failureCount > 0)
          console.log(
            `Failed to delete ${deleteUsersResult.failureCount} users`,
            deleteUsersResult
          );
      }
      if (deleteUsersResult.errors.length > 0) {
        deleteUsersResult.errors.forEach((error: any) => {
          if (DEBUG) console.error(error.error.toJSON());
        });
        return await throwError(deleteUsersResult.errors);
      } else return true;
    })
    .catch(async (error: any) => await throwError(error));

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
        customClaims: {isSuperAdmin: true, isAdmin: true, isStaff: true},
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
        customClaims: {isAdmin: true},
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
        customClaims: {isStaff: true},
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
              indexedError
            );
          }
        });
        return await throwError(results.errors);
      } else {
        if (DEBUG) {
          if (results.successCount > 0)
            console.log(
              `Successfully imported ${results.successCount} users`,
              results
            );
          if (results.failureCount > 0)
            console.log(
              `Failed to import ${results.failureCount} users`,
              results
            );
        }
        return true;
      }
    })
    .catch(async (error: any) => await throwError(error));

const importTestUser = async (email: string): Promise<boolean> => {
  const testUserAlreadyExists = await verifyExistingClient(email);
  if (testUserAlreadyExists === true) {
    if (DEBUG)
      console.log(
        `Test User Already Exists, Updating Firestore Document ID: ${proVetClientData.id}`
      );
    didImportTestUser = await saveClient(5125, proVetClientData, null);
  } else {
    if (DEBUG)
      console.log(
        `Test User Does NOT Exists, Creating New Auth User and Firestore Document for Client: ${proVetClientData.id}`
      );
    didImportTestUser = await createAuthClient({
      ...proVetClientData,
      email,
      password: "testing",
    });
  }
  if (didImportTestUser) return true;
  else return throwError("Failed to create test user");
};

const importPatientData = async () => {
  const patientIds: any = [];
  proVetClientData.patients.map((patientUrl: string) =>
    patientIds.push(getProVetIdFromUrl(patientUrl))
  );
  let patientsConfigured = 0;
  return await Promise.all(
    patientIds.map(async (patientId: string) => {
      const patient = await fetchEntity("patient", parseInt(patientId));
      await savePatient(patient);
      patientsConfigured++;
    })
  )
    .then(async () => {
      if (patientsConfigured === patientIds.length) return true;
      else
        return await throwError(
          `ERROR: ${patientsConfigured} Out of ${patientIds.length} Patients Imported`
        );
    })
    .catch(async (error: any) => await throwError(error));
};

const importCustomerData = async (stripeCustomerData: any) =>
  await admin
    .firestore()
    .collection("clients")
    .doc(`${5125}`)
    .set(
      {
        customer: stripeCustomerData,
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .catch(async (error: any) => await throwError(error));

const importCustomerPaymentMethod = async (paymentMethod: any) =>
  await admin
    .firestore()
    .collection("clients")
    .doc("5125")
    .collection("payment_methods")
    .doc(`${paymentMethod?.id}`)
    .set({...paymentMethod, active: true}, {merge: true})
    .catch(async (error: any) => await throwError(error));

const importTelehealthChat = async () =>
  await admin
    .firestore()
    .collection("telehealth_chat")
    .doc("5125")
    .set(
      {
        client: await admin
          .firestore()
          .collection("clients")
          .doc("5125")
          .get()
          .then((doc: any) => doc?.data()),
        question: "This is a test question...",
        status: "active",
        lastSlackThread: "12345",
        createdAt: new Date(),
      },
      {merge: true}
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("telehealth_chat")
          .doc("5125")
          .collection("log")
          .add({
            _id: "123",
            startNewThread: true,
            text: "This is a test question...",
            user: {
              _id: "5125",
              avatar: null,
              name: null,
            },
            createdAt: new Date(),
          })
          .catch(async (error: any) => await throwError(error))
    )
    .catch(async (error: any) => await throwError(error));

const importCheckIn = async (): Promise<boolean> => {
  const {firstName, lastName, phone} = await admin
    .firestore()
    .collection("clients")
    .doc("5125")
    .get()
    .then((doc: any) => doc?.data())
    .catch(async (error: any) => await throwError(error));
  return await admin
    .firestore()
    .collection("waitlist")
    .doc("alex.rodriguez+test@movetcare.com")
    .set(
      {
        customerId: "cus_LYg1C7Et5ySQKC",
        email: "alex.rodriguez+test@movetcare.com",
        firstName,
        id: "5125",
        isActive: true,
        lastName,
        paymentMethod: {
          ...(await stripe.paymentMethods.retrieve(
            "pm_1KrYgADVQU5TYLF15o8YdFox"
          )),
          active: true,
          updatedOn: new Date(),
        },
        phone,
        status: "complete",
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(() => true)
    .catch(async (error: any) => await throwError(error));
};
