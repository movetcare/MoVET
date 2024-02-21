import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";
import Error from "components/Error";
import { useEffect, useState } from "react";
import { Loader } from "ui";
import Terminal from "components/Terminal";
import InvoiceItem from "components/invoice/InvoiceItem";
import { InvoiceSearch } from "components/invoice/InvoiceSearch";

const Invoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isClientInvoice, setIsClientInvoice] = useState<boolean | null>(null);
  const [invoice, setInvoice] = useState<{
    id: number;
    client_due_sum: number;
    updatedOn: any;
    remarks: string;
    total: number;
    total_vat: number;
    total_with_vat: number;
    first_original_invoice: string;
    paymentIntentObject: any;
    paymentStatus: string;
    client: string;
    invoice_payment: Array<string>;
  } | null>(null);
  const [clientInvoice, loadingClientInvoice, errorClientInvoice] = useDocument(
    doc(firestore, `client_invoices/${id}`),
  );
  const [counterSale, loadingCounterSale, errorCounterSale] = useDocument(
    doc(firestore, `counter_sales/${id}`),
  );
  useEffect(() => {
    if (clientInvoice?.data() !== undefined) {
      setIsClientInvoice(true);
      setInvoice(clientInvoice?.data() as any);
    } else if (counterSale?.data() !== undefined) {
      setIsClientInvoice(false);
      setInvoice(counterSale?.data() as any);
    } else setIsClientInvoice(null);
  }, [
    clientInvoice,
    loadingClientInvoice,
    errorClientInvoice,
    counterSale,
    loadingCounterSale,
    errorCounterSale,
  ]);
  return isClientInvoice === null ||
    loadingClientInvoice ||
    loadingClientInvoice ||
    invoice === null ? (
    <>
      <InvoiceSearch />
      <div className="max-w-xl mx-auto">
        <Terminal />
      </div>
      <Loader />
    </>
  ) : errorClientInvoice || errorCounterSale ? (
    <>
      <InvoiceSearch />
      <div className="max-w-xl mx-auto">
        <Terminal />
      </div>
      <Error error={errorClientInvoice || errorCounterSale} />
    </>
  ) : (
    <>
      <InvoiceSearch />
      <div className="max-w-xl mx-auto">
        <Terminal />
      </div>
      <InvoiceItem invoice={invoice as any} mode="single" />
    </>
  );
};

export default Invoice;
