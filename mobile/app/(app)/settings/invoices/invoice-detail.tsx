import {
  Icon,
  BodyText,
  ItalicText,
  SubHeadingText,
  Screen,
  View,
  ActionButton,
} from "components/themed";
import { useLocalSearchParams } from "expo-router";
import { functions } from "firebase-config";
import { httpsCallable } from "firebase/functions";
import { useState, useEffect, useCallback } from "react";
import { ErrorStore, InvoicesStore } from "stores";
import type { Invoice } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

const InvoiceDetail = () => {
  const { id } = useLocalSearchParams();
  const { invoices } = InvoicesStore.useState();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isLoadingEmailInvoicePDF, setIsLoadingEmailInvoicePDF] =
    useState<boolean>(false);
  const [emailInvoiceAsPDFComplete, setEmailInvoiceAsPDFComplete] =
    useState<boolean>(false);

  useEffect(() => {
    if (id && invoices) {
      invoices.forEach((invoice: any) => {
        if (Number(invoice.id) === Number(id)) {
          setInvoice(invoice);
          if (invoice.creditNote) {
            invoices.forEach((i: Invoice) => {
              if (i.id === invoice.creditNote) {
                setPaymentMethod(i?.payments[0]?.paymentMethod);
              }
            });
          }
        }
      });
    }
  }, [id, invoices]);

  const emailInvoiceAsPDF = async () => {
    setIsLoadingEmailInvoicePDF(true);
    const processEmailInvoiceAsPDF = httpsCallable(
      functions,
      "manualClientRequest",
    );
    processEmailInvoiceAsPDF({
      invoice: invoice?.id,
    })
      .then((result: any) => {
        if (result.data === true) setEmailInvoiceAsPDFComplete(true);
        else
          handleError({
            code: 500,
            message: "Unable to email invoice as PDF",
          });
      })
      .catch((error: any) => handleError(error))
      .finally(() => setIsLoadingEmailInvoicePDF(false));
  };

  const handleError = useCallback((error: any) => {
    setIsLoadingEmailInvoicePDF(false);
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  }, []);

  return (
    <Screen>
      <View
        style={[
          tw`
              w-full flex-grow justify-center items-center bg-transparent
            `,
          isTablet ? tw`mb-8 px-16` : tw`mb-8 px-4`,
        ]}
        noDarkMode
      >
        <Icon name="clinic-alt" height={100} width={100} />
        <BodyText style={tw`text-xs`}>#{invoice?.id}</BodyText>
        <View style={tw`mb-4 w-full`}>
          {invoice &&
            invoice?.items.map((item: any, index: number) => (
              <View
                key={index}
                style={tw`w-full flex-row items-center justify-between${index !== invoice?.items.length - 1 ? " border-b-2 border-movet-gray/50" : ""}`}
              >
                <BodyText style={tw`text-sm my-2`}>
                  {item?.name}
                  {item?.quantity > 1 && ` x ${item?.quantity}`}
                </BodyText>
                <BodyText style={tw`text-sm my-2`}>
                  ${item?.total?.toFixed(2)}
                </BodyText>
              </View>
            ))}
          {invoice && (
            <>
              {invoice.taxDue > 0 && (
                <>
                  <View style={tw`flex-row items-center justify-between`}>
                    <ItalicText style={tw`text-sm mb-2 mt-4`}>
                      Subtotal
                    </ItalicText>
                    <ItalicText style={tw`text-sm mb-2 mt-4`}>
                      ${invoice?.amountDue?.toFixed(2)}
                    </ItalicText>
                  </View>
                  <View style={tw`flex-row items-center justify-between`}>
                    <ItalicText style={tw`text-sm mb-2`}>Tax</ItalicText>
                    <ItalicText style={tw`text-sm mb-2`}>
                      ${invoice?.taxDue?.toFixed(2)}
                    </ItalicText>
                  </View>
                </>
              )}
              <View
                style={tw`flex-row items-center justify-between border-t-2 border-movet-gray/50 pt-2 ${invoice.taxDue === 0 ? " mt-4" : ""}`}
              >
                <SubHeadingText>
                  {invoice?.totalDue < 0 ? "Total Refunded" : "Total Paid"}
                  {invoice?.payments[0]?.paymentMethod &&
                  !invoice?.payments[0]?.paymentMethod.includes("UNKNOWN")
                    ? ` w/ ${invoice?.payments[0]?.paymentMethod}`
                    : paymentMethod
                      ? paymentMethod.includes("UNKNOWN")
                        ? ""
                        : " to " + paymentMethod
                      : ""}
                </SubHeadingText>
                <SubHeadingText
                  style={tw`text-lg${invoice?.totalDue < 0 ? " text-movet-yellow" : " text-movet-green"}`}
                  noDarkMode
                >
                  ${invoice?.totalDue?.toFixed(2)}
                </SubHeadingText>
              </View>
            </>
          )}
          <ActionButton
            title={
              emailInvoiceAsPDFComplete
                ? "We'll send you an email shortly!"
                : "Send Invoice via Email"
            }
            color="black"
            disabled={emailInvoiceAsPDFComplete || isLoadingEmailInvoicePDF}
            iconName={emailInvoiceAsPDFComplete ? "check" : "envelope"}
            loading={isLoadingEmailInvoicePDF}
            onPress={() => emailInvoiceAsPDF()}
            style={tw`mt-16`}
          />
        </View>
      </View>
    </Screen>
  );
};

export default InvoiceDetail;
