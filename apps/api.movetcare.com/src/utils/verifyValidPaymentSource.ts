import { admin, stripe, throwError } from "../config/config";
const DEBUG = true;
export const verifyValidPaymentSource = async (
  client: string,
  customerId: string
): Promise<Array<any> | false> => {
  if (DEBUG) console.log("verifyValidPaymentSource => ", customerId);
  const paymentMethods: any = await stripe.customers.listPaymentMethods(
    customerId,
    {
      type: "card",
    }
  );
  const validPaymentMethods: Array<any> = [];
  for (let i = 0; i < paymentMethods?.data.length; i++) {
    const cardExpiryDate = new Date(
      paymentMethods?.data[i]?.card?.exp_year as any,
      (paymentMethods?.data[i]?.card?.exp_month as any) - 1
    );
    if (cardExpiryDate > new Date())
      validPaymentMethods.push(paymentMethods?.data[i]?.card);
  }
  if (DEBUG) {
    console.log("paymentMethods.data", paymentMethods.data);
    console.log("validPaymentMethods", validPaymentMethods);
  }
  if (validPaymentMethods.length > 0) {
    if (DEBUG) console.log("CHECKING INVOICE PAYMENT METHODS");
    const validInvoicePaymentMethods: Array<any> = [];
    const invoicePaymentMethods: any = await getInvoicePaymentMethods(client);
    validPaymentMethods.map((card: any) =>
      invoicePaymentMethods.docs.map((invoiceCard: any) => {
        if (DEBUG) console.log("invoiceCard", invoiceCard.data());
        if (invoiceCard.data().card.last4 === card.last4) {
          if (DEBUG)
            console.log(
              "VALID PAYMENT METHOD FOUND!",
              `${card?.brand?.toUpperCase()} - ${card?.last4}`
            );
          validInvoicePaymentMethods.push(
            `${card?.brand?.toUpperCase()} - ${card?.last4}`
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
    .catch((error: any) => throwError(error));
