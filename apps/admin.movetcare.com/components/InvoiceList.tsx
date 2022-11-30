import { Loader } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error from "components/Error";
import InvoiceItem from "./InvoiceItem";
import environment from "utils/environment";
import { useState } from "react";
import {
  faCaretDown,
  faCaretUp,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

const InvoiceList = ({
  title,
  icon,
  invoices,
  loading,
  error,
  containerStyle,
  collapse = false,
}: {
  title: string;
  icon: any;
  invoices: any;
  loading: boolean;
  error: any;
  containerStyle?: string;
  collapse?: boolean;
}) => {
  const [hideList, setHideList] = useState(collapse);
  return (
    <div
      className={`bg-white shadow overflow-hidden rounded-lg${
        containerStyle ? ` ${containerStyle}` : ""
      }${
        collapse
          ? "rounded-t-none divide-y divide-movet-gray border-t border-movet-gray"
          : ""
      }`}
    >
      <div className="flex-1 flex items-center">
        <div
          className={`w-full flex flex-row items-center justify-center -mb-4${
            collapse
              ? " cursor-pointer hover:bg-movet-black hover:text-movet-white"
              : ""
          }${!hideList && collapse ? " bg-movet-green bg-opacity-85" : ""}`}
          onClick={() => (collapse ? setHideList(!hideList) : null)}
        >
          <FontAwesomeIcon
            icon={icon}
            color={collapse ? "#FFF" : "#E76159"}
            size={collapse ? "sm" : "lg"}
          />

          {collapse ? (
            <h2
              className={`ml-2 text-sm my-3 font-bold${
                !hideList ? " text-movet-white" : ""
              }`}
            >
              {loading ? "Loading Invoices" : title}
            </h2>
          ) : (
            <h1 className="ml-2 text-lg my-6">
              {loading ? "Loading Invoices" : title}
            </h1>
          )}
          {collapse && (
            <div className="ml-2">
              {!hideList ? (
                <FontAwesomeIcon
                  icon={faCaretDown}
                  size="xs"
                  color={
                    collapse ? (!hideList ? "#FFF" : "#00A36C") : "#E76159"
                  }
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCaretUp}
                  size="xs"
                  color={collapse ? "#FFF" : "#E76159"}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="mb-6">
          <Loader height={200} width={200} />
        </div>
      ) : error ? (
        <div className="px-8 pb-8">
          <Error error={error} />
        </div>
      ) : (
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
        >
          {invoices && invoices.docs.length < 1 && (
            <a
              href={
                environment === "production"
                  ? "https://us.provetcloud.com/4285/billing/invoice/"
                  : "https://us.provetcloud.com/4285/billing/invoice/"
              }
              target="_blank"
              className="flex flex-row bg-movet-black justify-center items-center p-4 italic uppercase font-medium text-sm text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
              rel="noreferrer"
            >
              <span className="mr-2">
                <FontAwesomeIcon icon={faFileInvoice} size="lg" />
              </span>
              Create an Invoice
            </a>
          )}
          {!hideList &&
            invoices &&
            invoices.docs.map((invoice: any, index: number) => (
              <InvoiceItem key={index} invoice={invoice?.data()} />
            ))}
        </ul>
      )}
    </div>
  );
};

export default InvoiceList;
