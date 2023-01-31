import { admin, environment, throwError } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
const DEBUG = environment.type === "production";
export const configureInvoices = async (): Promise<boolean> => {
  const alreadyHasClientInvoiceConfiguration = await admin
    .firestore()
    .collection("client_invoices")
    .limit(1)
    .get()
    .then((snapshot: any) => (snapshot.docs[0].data() ? true : false))
    .catch(() => false);

  const alreadyHasCounterSaleInvoiceConfiguration = await admin
    .firestore()
    .collection("counter_sales")
    .limit(1)
    .get()
    .then((snapshot: any) => (snapshot.docs[0].data() ? true : false))
    .catch(() => false);

  if (
    alreadyHasClientInvoiceConfiguration &&
    alreadyHasCounterSaleInvoiceConfiguration
  ) {
    console.log(
      "client_invoices/ & counter_sales COLLECTIONS DETECTED - SKIPPING INVOICE CONFIGURATION..."
    );
    console.log(
      "DELETE THE client_invoices/ & counter_sales COLLECTIONS AND RESTART TO REFRESH THE INVOICE CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING INVOICES CONFIGURATION");
    const invoices: Array<any> = await fetchEntity("invoice");
    if (DEBUG) console.log("INVOICES DATA =>", invoices);
    if (invoices) {
      const batch = admin.firestore().batch();
      invoices
        .slice()
        .reverse()
        .forEach((invoice: any, index: number) => {
          if (invoice.client && index <= 100) {
            batch.set(
              admin
                .firestore()
                .collection("client_invoices")
                .doc(`${invoice?.id}`),
              { ...invoice },
              { merge: true }
            );
            batch.set(
              admin
                .firestore()
                .collection("clients")
                .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                .collection("invoices")
                .doc(`${invoice?.id}`),
              { ...invoice },
              { merge: true }
            );
          } else if (index <= 100) {
            batch.set(
              admin
                .firestore()
                .collection("counter_sales")
                .doc(`${invoice?.id}`),
              { ...invoice },
              { merge: true }
            );
          }
        });
      return batch
        .commit()
        .then(() => {
          if (DEBUG) console.log("SUCCESSFULLY IMPORTED ALL INVOICES");
          return true;
        })
        .catch((error: any) => throwError(error));
    } else return throwError("Failed to Process invoices");
  }
};
