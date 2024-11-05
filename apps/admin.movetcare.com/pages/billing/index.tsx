import {
  faCheckToSlot,
  faFileInvoiceDollar,
  faHomeUser,
} from "@fortawesome/free-solid-svg-icons";
import InvoiceList from "components/invoice/InvoiceList";
import { InvoiceSearch } from "components/invoice/InvoiceSearch";
import Terminal from "components/Terminal";
import { query, collection, where, orderBy, limit } from "firebase/firestore";
import Head from "next/head";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";

export default function Billing() {
  const [counterSales, loadingCounterSales, errorCounterSales] = useCollection(
    query(
      collection(firestore, "counter_sales"),
      where("client_due_sum", ">", 0),
      where("credit_note", "==", false),
      where("status", "==", 3),
      orderBy("client_due_sum", "desc"),
    ),
  );
  const [clientInvoices, loadingClientInvoices, errorClientInvoices] =
    useCollection(
      query(
        collection(firestore, "client_invoices"),
        where("credit_note", "==", false),
        where("client_due_sum", ">", 0),
        where("status", "==", 3),
        orderBy("client_due_sum", "desc"),
      ),
    );

  const [
    completedCounterSales,
    loadingCompletedCounterSales,
    errorCompletedCounterSales,
  ] = useCollection(
    query(
      collection(firestore, "counter_sales"),
      where("client_due_sum", "==", 0),
      where("status", "==", 3),
      orderBy("updatedOn", "desc"),
      limit(50),
    ),
  );
  const [
    completedClientInvoices,
    loadingCompletedClientInvoices,
    errorCompletedClientInvoices,
  ] = useCollection(
    query(
      collection(firestore, "client_invoices"),
      where("client_due_sum", "==", 0),
      where("status", "==", 3),
      orderBy("updatedOn", "desc"),
      limit(50),
    ),
  );

  return (
    <section>
      <Head>
        <title>Billing</title>
      </Head>
      <InvoiceSearch />
      <Terminal />
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <InvoiceList
            title="Outstanding Counter Sales"
            icon={faFileInvoiceDollar}
            invoices={counterSales}
            loading={loadingCounterSales}
            error={errorCounterSales}
            containerStyle="rounded-b-none"
          />
          {((completedCounterSales && completedCounterSales.docs.length > 0) ||
            errorCompletedCounterSales) && (
            <InvoiceList
              collapse
              title="Completed Counter Sales"
              icon={faCheckToSlot}
              invoices={completedCounterSales}
              loading={loadingCompletedCounterSales}
              error={errorCompletedCounterSales}
            />
          )}
        </div>
        <div>
          <InvoiceList
            title="Outstanding Client Invoices"
            icon={faHomeUser}
            invoices={clientInvoices}
            loading={loadingClientInvoices}
            error={errorClientInvoices}
            containerStyle="mt-4 sm:mt-0 rounded-b-none"
          />
          {((completedClientInvoices &&
            completedClientInvoices.docs.length > 0) ||
            errorCompletedClientInvoices) && (
            <InvoiceList
              collapse
              title="Completed Client Invoices"
              icon={faCheckToSlot}
              invoices={completedClientInvoices}
              loading={loadingCompletedClientInvoices}
              error={errorCompletedClientInvoices}
            />
          )}
        </div>
      </div>
    </section>
  );
}
