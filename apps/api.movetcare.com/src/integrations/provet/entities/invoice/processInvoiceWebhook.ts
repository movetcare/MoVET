import {Request, Response} from "express";
import {admin, throwError, DEBUG} from "../../../../config/config";
import {getProVetIdFromUrl} from "../../../../utils/getProVetIdFromUrl";
import {saveClient} from "../client/saveClient";
import {fetchEntity} from "../fetchEntity";

export const processInvoiceWebhook = async (
  request: Request,
  response: Response
): Promise<any> => {
  const {invoice_id, user, timestamp} = request.body;
  if (!(typeof invoice_id === "string") || invoice_id.length === 0)
    throwError({message: "INVALID_PAYLOAD"});
  try {
    if (DEBUG) console.log(`processInvoiceWebhook ID: ${invoice_id}`);
    const invoice = await fetchEntity("invoice", invoice_id);
    if (DEBUG)
      console.log("processInvoiceWebhook Invoice Details => ", invoice);

    const invoiceItemDetails: any = [];

    if (invoice?.invoice_row && invoice?.invoice_row.length > 0) {
      for (let i = 0; i < invoice?.invoice_row.length; i++) {
        const invoiceItem = await fetchEntity(
          "invoicerow",
          getProVetIdFromUrl(invoice?.invoice_row[i])
        );
        invoiceItemDetails.push(invoiceItem);
      }
    }

    if (DEBUG) console.log("invoiceItemDetails", invoiceItemDetails);

    const invoicePaymentDetails: any = [];

    if (invoice?.invoice_payment && invoice?.invoice_payment.length > 0) {
      for (let i = 0; i < invoice?.invoice_payment.length; i++) {
        const invoicePaymentItem = await fetchEntity(
          "invoicepayment",
          getProVetIdFromUrl(invoice?.invoice_payment[i])
        );
        invoicePaymentDetails.push(invoicePaymentItem);
      }
    }

    if (DEBUG) console.log("invoicePaymentDetails", invoicePaymentDetails);

    return invoice?.client
      ? await admin
          .firestore()
          .collection("client_invoices")
          .doc(`${invoice_id}`)
          .set(
            {
              ...invoice,
              syncUser: user,
              lastSync: timestamp,
              updatedOn: new Date(),
            },
            { merge: true }
          )
          .then(async () => {
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("client_invoices")
                  .doc(`${invoice_id}`)
                  .collection("items")
                  .doc(`${invoiceItemDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoiceItemDetails[i],
                    },
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENT INVOICE ITEM: ${invoiceItemDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("client_invoices")
                  .doc(`${invoice_id}`)
                  .collection("payments")
                  .doc(`${invoicePaymentDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoicePaymentDetails[i],
                    },
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENT INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            const client: any = await fetchEntity(
              "client",
              getProVetIdFromUrl(invoice?.client)
            );
            if (DEBUG) console.log("client", client);
            await saveClient(client?.id, client);
            return await admin
              .firestore()
              .collection("clients")
              .doc(`${getProVetIdFromUrl(invoice?.client)}`)
              .collection("invoices")
              .doc(`${invoice_id}`)
              .set(
                {
                  ...invoice,
                  syncUser: user,
                  lastSync: timestamp,
                  updatedOn: new Date(),
                },
                { merge: true }
              )
              .catch((error: any) => throwError(error));
          })
          .then(async () => {
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("clients")
                  .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                  .collection("invoices")
                  .doc(`${invoice_id}`)
                  .collection("items")
                  .doc(`${invoiceItemDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoiceItemDetails[i],
                    },
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENTS INVOICE ITEM: ${invoiceItemDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("clients")
                  .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                  .collection("invoices")
                  .doc(`${invoice_id}`)
                  .collection("items")
                  .doc(`${invoicePaymentDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoicePaymentDetails[i],
                    },
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENTS INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice
                );
              await admin
                .firestore()
                .collection("client_invoices")
                .doc(
                  `${getProVetIdFromUrl(invoice?.credit_note_original_invoice)}`
                )
                .set(
                  { updatedOn: new Date(), paymentStatus: "fully-refunded" },
                  { merge: true }
                )
                .then(
                  async () =>
                    await admin
                      .firestore()
                      .collection("clients")
                      .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                      .collection("invoices")
                      .doc(
                        `${getProVetIdFromUrl(
                          invoice?.credit_note_original_invoice
                        )}`
                      )
                      .set(
                        {
                          updatedOn: new Date(),
                          paymentStatus: "fully-refunded",
                        },
                        { merge: true }
                      )
                      .catch(async (error: any) => throwError(error))
                )
                .catch((error: any) => throwError(error));
            }
          })
          .then(() => response.status(200).send({ received: true }))
          .catch(async (error: any) => throwError(error))
      : await admin
          .firestore()
          .collection("counter_sales")
          .doc(`${invoice_id}`)
          .set(
            {
              ...invoice,
              syncUser: user,
              lastSync: timestamp,
              updatedOn: new Date(),
            },
            { merge: true }
          )
          .then(async () => {
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                await admin
                  .firestore()
                  .collection("counter_sales")
                  .doc(`${invoice?.id}`)
                  .collection("items")
                  .doc(`${invoiceItemDetails[i]?.id}`)
                  .set(
                    {
                      updatedOn: new Date(),
                      ...invoiceItemDetails[i],
                    },
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED COUNTER SALE INVOICE ITEM: ${invoiceItemDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
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
                    { merge: true }
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED COUNTER SALE INVOICE ITEM: ${invoicePaymentDetails[i]?.id}`
                      )
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice
                );
              await admin
                .firestore()
                .collection("counter_sales")
                .doc(
                  `${getProVetIdFromUrl(invoice?.credit_note_original_invoice)}`
                )
                .set(
                  { updatedOn: new Date(), paymentStatus: "fully-refunded" },
                  { merge: true }
                )
                .catch((error: any) => throwError(error));
            }
          })
          .then(() => response.status(200).send({ received: true }))
          .catch((error: any) => throwError(error));
  } catch (error: any) {
    if (DEBUG) console.error(error);
    return response.status(500).send({received: false});
  }
};
