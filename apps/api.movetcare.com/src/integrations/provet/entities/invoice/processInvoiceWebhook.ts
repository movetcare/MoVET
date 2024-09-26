import { Request, Response } from "express";
import { admin, throwError, DEBUG } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { saveClient } from "../client/saveClient";
import { fetchEntity } from "../fetchEntity";
import { sendNotification } from "../../../../notifications/sendNotification";
import { truncateString } from "../../../../utils/truncateString";

export const processInvoiceWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { invoice_id, user, timestamp } = request.body;
  if (!(typeof invoice_id === "string") || invoice_id.length === 0)
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    if (DEBUG) console.log(`processInvoiceWebhook ID: ${invoice_id}`);
    const invoice = await fetchEntity("invoice", invoice_id);
    if (DEBUG)
      console.log("processInvoiceWebhook Invoice Details => ", invoice);
    if (invoice?.status === 3 && invoice?.client_due_sum !== 0) {
      admin
        .firestore()
        .collection("appointments")
        .where("consultation", "==", getProVetIdFromUrl(invoice?.consultation))
        .limit(1)
        .get()
        .then((querySnapshot: any) => {
          if (querySnapshot?.docs?.length > 0) {
            querySnapshot.forEach(async (doc: any) => {
              admin
                .firestore()
                .collection("appointments")
                .doc(doc.id)
                .set(
                  {
                    status: "AWAITING-PAYMENT",
                    updatedOn: new Date(),
                  },
                  { merge: true },
                )
                .then(async () => {
                  sendNotification({
                    type: "push",
                    payload: {
                      user: { uid: getProVetIdFromUrl(doc.data()?.client) },
                      category: "client-appointment",
                      title: "Your Invoice from MoVET is Ready!",
                      message: truncateString(
                        "Please open the MoVET app to view and pay your invoice...",
                      ),
                      path: "/home/",
                    },
                  });
                })
                .catch((error: any) => throwError(error));
            });
          } else if (DEBUG)
            console.log(
              "NO APPOINTMENT W CONSULTATION ID FOUND",
              getProVetIdFromUrl(invoice?.consultation),
            );
        });
    }
    // else if (invoice?.status === 3 && invoice?.client_due_sum === 0) {
    //   admin
    //     .firestore()
    //     .collection("appointments")
    //     .where("consultation", "==", getProVetIdFromUrl(invoice?.consultation))
    //     .limit(1)
    //     .get()
    //     .then((querySnapshot: any) => {
    //       if (querySnapshot?.docs?.length > 0)
    //         querySnapshot.forEach(async (doc: any) =>
    //           admin.firestore().collection("appointments").doc(doc.id).set(
    //             {
    //               status: "COMPLETE",
    //               updatedOn: new Date(),
    //             },
    //             { merge: true },
    //           ),
    //         );
    //       else if (DEBUG)
    //         console.log(
    //           "NO APPOINTMENT W CONSULTATION ID FOUND",
    //           getProVetIdFromUrl(invoice?.consultation),
    //         );
    //     });
    // }

    const invoiceItemDetails: any = [];

    if (invoice?.invoice_row && invoice?.invoice_row.length > 0) {
      for (let i = 0; i < invoice?.invoice_row.length; i++) {
        const invoiceItem = await fetchEntity(
          "invoicerow",
          getProVetIdFromUrl(invoice?.invoice_row[i]),
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
          getProVetIdFromUrl(invoice?.invoice_payment[i]),
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
            { merge: true },
          )
          .then(() => {
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                admin
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
                    { merge: true },
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENT INVOICE ITEM: ${invoiceItemDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(() => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                admin
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
                    { merge: true },
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED CLIENT INVOICE PAYMENT: ${invoicePaymentDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(async () => {
            const client: any = await fetchEntity(
              "client",
              getProVetIdFromUrl(invoice?.client),
            );
            if (DEBUG) console.log("client", client);
            await saveClient(client?.id, client);
            const invoiceItems: Array<any> = [];
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                invoiceItems.push({
                  id: invoiceItemDetails[i]?.id,
                  itemId: getProVetIdFromUrl(invoiceItemDetails[i]?.item),
                  name: invoiceItemDetails[i]?.name,
                  quantity: invoiceItemDetails[i]?.quantity,
                  price: invoiceItemDetails[i]?.sum,
                  tax: invoiceItemDetails[i]?.sum_vat,
                  total: invoiceItemDetails[i]?.sum_total,
                  patient: null,
                });
              }
            }
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
            admin
              .firestore()
              .collection("clients")
              .doc(`${getProVetIdFromUrl(invoice?.client)}`)
              .collection("invoices")
              .doc(`${invoice_id}`)
              .set(
                {
                  amountDue: invoice?.total,
                  taxDue: invoice?.total_vat,
                  totalDue: invoice?.total_with_vat,
                  consultation: getProVetIdFromUrl(invoice?.consultation),
                  patients: invoice?.patients.map((patientId: string) =>
                    getProVetIdFromUrl(patientId),
                  ),
                  remarks: invoice?.remarks || null,
                  payments,
                  paymentStatus: payments?.length > 0 ? "succeeded" : null,
                  items: invoiceItems,
                  creditNote: invoice?.credit_note
                    ? getProVetIdFromUrl(invoice?.credit_note_original_invoice)
                    : null,
                  id: Number(invoice_id),
                  updatedOn: new Date(),
                },
                { merge: true },
              )
              .catch((error: any) => throwError(error));
          })
          .then(() => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice,
                );
              admin
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
                .then(() =>
                  admin
                    .firestore()
                    .collection("clients")
                    .doc(`${getProVetIdFromUrl(invoice?.client)}`)
                    .collection("invoices")
                    .doc(
                      `${getProVetIdFromUrl(
                        invoice?.credit_note_original_invoice,
                      )}`,
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
          .doc(`${invoice_id}`)
          .set(
            {
              ...invoice,
              syncUser: user,
              lastSync: timestamp,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .then(() => {
            if (invoiceItemDetails && invoiceItemDetails.length > 0) {
              for (let i = 0; i < invoiceItemDetails.length; i++) {
                admin
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
                    { merge: true },
                  )
                  .then(
                    () =>
                      DEBUG &&
                      console.log(
                        `SUCCESSFULLY UPDATED COUNTER SALE INVOICE ITEM: ${invoiceItemDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(() => {
            if (invoicePaymentDetails && invoicePaymentDetails.length > 0) {
              for (let i = 0; i < invoicePaymentDetails.length; i++) {
                admin
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
                        `SUCCESSFULLY UPDATED COUNTER SALE INVOICE ITEM: ${invoicePaymentDetails[i]?.id}`,
                      ),
                  )
                  .catch((error: any) => throwError(error));
              }
            }
          })
          .then(() => {
            if (invoice?.credit_note_original_invoice) {
              if (DEBUG)
                console.log(
                  "invoice?.credit_note_original_invoice",
                  invoice?.credit_note_original_invoice,
                );
              admin
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
