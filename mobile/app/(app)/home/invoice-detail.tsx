import { BodyText, ItalicText, Screen } from "components/themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { InvoicesStore } from "stores";
import type { Invoice } from "stores";

const InvoiceDetail = () => {
  const { id } = useLocalSearchParams();
  const { invoices } = InvoicesStore.useState();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (id && invoices) {
      invoices.forEach((invoice: any) => {
        if (invoice.id === Number(id)) setInvoice(invoice);
      });
    }
  }, [id, invoices]);

  return (
    <Screen>
      <ItalicText>Invoice #{id}</ItalicText>
      <BodyText>{JSON.stringify(invoice)}</BodyText>
    </Screen>
  );
};

export default InvoiceDetail;
