import { Loader } from "ui";
import { query, collection } from "firebase/firestore";
import Error from "components/Error";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";
import environment from "utils/environment";

export const InvoiceItems = ({
  isClientInvoice,
  id,
}: {
  isClientInvoice: boolean;
  id: number;
}) => {
  if (environment !== "production")
    console.log("InvoiceItems Props", {
      isClientInvoice,
      id,
    });
  const [invoiceItems, loadingInvoiceItems, errorInvoiceItems]: any =
    useCollection(
      query(
        collection(
          firestore,
          `${
            isClientInvoice ? "client_invoices" : "counter_sales"
          }/${id}/items`,
        ),
      ),
    );
  return !loadingInvoiceItems &&
    invoiceItems &&
    invoiceItems.docs.length > 0 ? (
    invoiceItems.docs.map((item: any, index: number) => (
      <div
        key={item.data()?.name}
        className={`flex flex-row justify-between items-center py-2 w-full${
          index !== invoiceItems.docs.length - 1 ? " border-b" : " border-none"
        }`}
      >
        <h3 className="text-sm">
          {item.data()?.name}
          <span className="text-xs">
            {item.data()?.quantity > 1 && ` - ${item.data()?.quantity}X`}
          </span>
        </h3>
        <p>${item.data()?.sum?.toFixed(2)}</p>
      </div>
    ))
  ) : errorInvoiceItems ? (
    <Error error={errorInvoiceItems} />
  ) : (
    <Loader />
  );
};
