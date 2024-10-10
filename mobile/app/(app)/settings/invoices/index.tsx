import { UnpaidInvoiceNotice } from "components/home/UnpaidInvoiceNotice";
import {
  Container,
  Icon,
  ItalicText,
  Screen,
  SubHeadingText,
  View,
} from "components/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { InvoicesStore } from "stores";
import type { Invoice } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

const Invoices = () => {
  const { invoices } = InvoicesStore.useState();
  const [unpaidInvoices, setUnpaidInvoices] = useState<Array<Invoice> | null>(
    null,
  );
  const [closedInvoices, setClosedInvoices] = useState<Array<Invoice> | null>(
    null,
  );

  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const unpaidInvoices: Array<Invoice> = [];
      const closedInvoices: Array<Invoice> = [];
      invoices.forEach((invoice: Invoice) => {
        if (
          ((invoice.paymentStatus !== "succeeded" &&
            invoice.paymentStatus !== "fully-refunded" &&
            invoice.paymentStatus !== "partially-refunded" &&
            invoice.paymentStatus !== "canceled") ||
            invoice.paymentStatus === null) &&
          invoice?.status === 3
        )
          unpaidInvoices.push(invoice);
        else closedInvoices.push(invoice);
      });
      closedInvoices.sort((a: any, b: any) => Number(b.id) - Number(a.id));
      setClosedInvoices(closedInvoices);
      setUnpaidInvoices(unpaidInvoices);
    }
  }, [invoices]);

  return (
    <Screen>
      {unpaidInvoices && (
        <>
          <View noDarkMode style={tw`h-4`} />
          <UnpaidInvoiceNotice unpaidInvoices={unpaidInvoices} />
        </>
      )}
      <View style={[isTablet ? tw`px-16` : tw`px-4`, tw`w-full`]} noDarkMode>
        {closedInvoices &&
          closedInvoices?.map((invoice: Invoice, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.navigate({
                    pathname: "/(app)/settings/invoices/invoice-detail",
                    params: {
                      id: invoice.id,
                    },
                  })
                }
              >
                <View
                  noDarkMode
                  style={tw`px-4 py-3 my-2 bg-movet-white rounded-xl flex-row items-center justify-between w-full${invoice.totalDue < 0 ? " bg-movet-yellow" : " bg-movet-green"}`}
                >
                  <Container style={tw`flex-row items-center`}>
                    <Icon
                      name="clipboard-medical"
                      height={20}
                      width={20}
                      color={"white"}
                    />

                    <SubHeadingText
                      style={tw`ml-2 text-movet-white`}
                      noDarkMode
                    >
                      #{invoice.id}
                    </SubHeadingText>
                    <SubHeadingText
                      style={tw`ml-2 text-movet-white text-xs`}
                      noDarkMode
                    >
                      {invoice?.updatedOn
                        ?.toDate()
                        ?.toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                    </SubHeadingText>
                    {invoice.totalDue < 0 && (
                      <ItalicText
                        style={tw`ml-2 text-xs text-movet-white`}
                        noDarkMode
                      >
                        (REFUND)
                      </ItalicText>
                    )}
                  </Container>
                  <Container style={tw`flex-row items-center`}>
                    <SubHeadingText style={tw`text-movet-white`} noDarkMode>
                      ${invoice.totalDue.toFixed(2)}
                    </SubHeadingText>
                  </Container>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    </Screen>
  );
};

export default Invoices;
