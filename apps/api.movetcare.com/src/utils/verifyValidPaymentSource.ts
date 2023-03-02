import { admin, stripe, throwError } from "../config/config";
const DEBUG = false; // environment.type === "production";
export const verifyValidPaymentSource = async (
  client: string,
  customerId: string,
  details = false
): Promise<Array<any> | false> => {
  if (DEBUG) console.log("verifyValidPaymentSource => ", customerId);
  const paymentMethods: any = await stripe.customers.listPaymentMethods(
    customerId
  );
  const validPaymentMethods: Array<any> = [];
  for (let i = 0; i < paymentMethods?.data.length; i++) {
    const cardExpiryDate = new Date(
      paymentMethods?.data[i]?.card?.exp_year as any,
      (paymentMethods?.data[i]?.card?.exp_month as any) - 1
    );
    if (cardExpiryDate > new Date())
      validPaymentMethods.push(paymentMethods?.data[i]);
  }
  if (DEBUG) {
    console.log("paymentMethods.data", paymentMethods.data);
    console.log("validPaymentMethods", validPaymentMethods);
  }
  if (validPaymentMethods.length > 0) {
    if (DEBUG) console.log("CHECKING INVOICE PAYMENT METHODS");
    const validInvoicePaymentMethods: Array<any> = [];
    const invoicePaymentMethods: any = await getInvoicePaymentMethods(client);
    validPaymentMethods.map((stripePaymentMethod: any) =>
      invoicePaymentMethods.map((invoicePaymentMethod: any) => {
        if (DEBUG) {
          console.log("stripePaymentMethod", stripePaymentMethod);
          console.log("invoicePaymentMethod", invoicePaymentMethod);
        }
        if (invoicePaymentMethod.id === stripePaymentMethod.id) {
          if (DEBUG)
            console.log(
              "VALID PAYMENT METHOD FOUND!",
              `${stripePaymentMethod?.card?.brand?.toUpperCase()} - ${
                stripePaymentMethod?.card?.last4
              }`
            );
          if (details) validInvoicePaymentMethods.push(stripePaymentMethod);
          else
            validInvoicePaymentMethods.push(
              `${stripePaymentMethod?.card?.brand?.toUpperCase()} - ${
                stripePaymentMethod?.card?.last4
              }`
            );
        }
      })
    );
    if (DEBUG)
      console.log("validInvoicePaymentMethods", validInvoicePaymentMethods);
    return validInvoicePaymentMethods;
  } else {
    if (DEBUG) console.log("NO VALID PAYMENT METHODS FOUND");
    return false;
  }
};

const getInvoicePaymentMethods = async (client: string): Promise<any> =>
  await admin
    .firestore()
    .collection("clients")
    .doc(client)
    .collection("payment_methods")
    .get()
    .then((snapshot: any) => {
      const paymentMethods: Array<any> = [];
      snapshot.docs.map((doc: any) => {
        if (doc.data().active) paymentMethods.push(doc.data());
      });
      return paymentMethods;
    })
    .catch((error: any) => throwError(error));
