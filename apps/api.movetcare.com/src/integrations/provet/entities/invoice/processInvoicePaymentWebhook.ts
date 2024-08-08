import { admin, throwError, DEBUG } from "../../../../config/config";
import { Request, Response } from "express";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";

export const processInvoicePaymentWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { invoicepayment_id } = request.body;
  if (
    !(typeof invoicepayment_id === "string") ||
    invoicepayment_id.length === 0
  )
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    if (DEBUG)
      console.log(`processInvoicePaymentWebhook ID: ${invoicepayment_id}`);
    const invoicepayment = await fetchEntity(
      "invoicepayment",
      invoicepayment_id,
    );
    if (DEBUG)
      console.log(
        "processInvoicePaymentWebhook Invoice Payment Details => ",
        invoicepayment,
      );
    const invoice = await fetchEntity(
      "invoice",
      getProVetIdFromUrl(invoicepayment?.invoice),
    );
    if (DEBUG)
      console.log("processInvoicePaymentWebhook Invoice Details => ", invoice);

    const invoicePaymentDetails: any = [];

    if (invoice?.invoice_payment && invoice?.invoice_payment.length > 0) {
      for (let i = 0; i < invoice?.invoice_payment.length; i++) {
        const invoicePaymentItem = await fetchEntity(
          "invoicepayment",
          getProVetIdFromUrl(invoice?.invoice_payment[i]),
        );
        invoicePaymentDetails.push(invoicePaymentItem);
      }
    }

    if (DEBUG)
      console.log(
        "processInvoicePaymentWebhook invoicePaymentDetails",
        invoicePaymentDetails,
      );

    return invoice?.client
      ? await admin
          .firestore()
          .collection("client_invoices")
          .doc(`${invoice?.id}`)
          .set(
            {
              ...invoice,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .then(async () => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("client_invoices")
                  .doc(`${invoice?.id}`)
                  .collection("payments")
                  .doc(`${invoicePaymentDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoicePaymentDetails[i],
                    },
                    { merge: true },
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `processInvoicePaymentWebhook => SUCCESSFULLY UPDATED CLIENT INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            const payments: Array<any> = [];
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                payments.push({
                  id: invoicePaymentDetails[i]?.id,
                  paid: invoicePaymentDetails[i]?.paid,
                  paymentMethod: invoicePaymentDetails[i]?.info,
                  invoice: getProVetIdFromUrl(
                    invoicePaymentDetails[i]?.invoice,
                  ),
                });
              }
            }
            await admin
              .firestore()
              .collection("clients")
              .doc(`${getProVetIdFromUrl(invoice?.client)}`)
              .collection("invoices")
              .doc(`${invoice?.id}`)
              .set(
                {
                  payments,
                  updatedOn: new Date(),
                },
                { merge: true },
              )
              .then(async () => {
                if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
                  for (let i = 0; i < invoicePaymentDetails.length; i++) {
                    await admin
                      .firestore()
                      .collection("client_invoices")
                      .doc(`${invoice?.id}`)
                      .collection("payments")
                      .doc(`${invoicePaymentDetails[i]?.id}`)
                      .set(
                        {
                          updatedOn: new Date(),
                          ...invoicePaymentDetails[i],
                        },
                        { merge: true },
                      )
                      .then(
                        () =>
                          DEBUG &&
                          console.log(
                            `processInvoicePaymentWebhook => SUCCESSFULLY UPDATED CLIENT INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`,
                          ),
                      )
                      .catch((error: any) => throwError(error));
                  }
                }
              })
              .catch((error: any) => throwError(error));
          })
          .then(async () => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "processInvoicePaymentWebhook => invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice,
                );
              await admin
                .firestore()
                .collection("client_invoices")
                .doc(
                  `${getProVetIdFromUrl(
                    invoice?.credit_note_original_invoice,
                  )}`,
                )
                .set(
                  { updatedOn: new Date(), paymentStatus: "fully-refunded" },
                  { merge: true },
                )
                .then(
                  async () =>
                    await admin
                      .firestore()
                      .collection("clients")
                      .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                      .collection("invoices")
                      .doc(
                        getProVetIdFromUrl(
                          `${invoice?.credit_note_original_invoice}`,
                        ),
                      )
                      .set(
                        {
                          updatedOn: new Date(),
                          paymentStatus: "fully-refunded",
                        },
                        { merge: true },
                      )
                      .catch((error: any) => throwError(error)),
                )
                .catch((error: any) => throwError(error));
            }
          })
          .then(() => response.status(200).send({ received: true }))
          .catch((error: any) => throwError(error))
      : await admin
          .firestore()
          .collection("counter_sales")
          .doc(`${invoice?.id}`)
          .set(
            {
              ...invoice,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .then(async () => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("counter_sales")
                  .doc(`${invoice?.id}`)
                  .collection("payments")
                  .doc(`${invoicePaymentDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoicePaymentDetails[i],
                    },
                    { merge: true },
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `processInvoicePaymentWebhook => SUCCESSFULLY UPDATED CLIENT INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "processInvoicePaymentWebhook => invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice,
                );
              await admin
                .firestore()
                .collection("counter_sales")
                .doc(
                  `${getProVetIdFromUrl(
                    invoice?.credit_note_original_invoice,
                  )}`,
                )
                .set(
                  { updatedOn: new Date(), paymentStatus: "fully-refunded" },
                  { merge: true },
                )
                .catch((error: any) => throwError(error));
            }
          })
          .then(() => response.status(200).send({ received: true }))
          .catch((error: any) => throwError(error));
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
