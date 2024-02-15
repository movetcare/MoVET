import { useEffect, useState } from "react";
import Error from "./Error";
import Select, { components } from "react-select";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { PROVET_APP_BASE_URL, PROVET_INVOICE_PATH } from "constants/urls";

interface Option {
  id: string;
  label: string;
  total: number;
  payer_name: string;
  updatedOn: string;
}

export const InvoiceSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm]: any = useState<string>();
  const [options, setOptions] = useState<Array<Option> | null>(null);
  const [invoiceData, loading, error] = useCollection(
    collection(firestore, "client_invoices"),
  );
  useEffect(() => {
    if (invoiceData) {
      const invoices: Array<Option> = [];
      invoiceData.docs.map((invoice: any) => {
        const { id, total, payer_name, updatedOn } = invoice.data();
        invoices.push({
          id: id.toString(),
          label: payer_name
            ? `$${total?.toFixed(2)?.toString()} - ${payer_name}`
            : `$${total?.toFixed(2)?.toString()}`,
          payer_name,
          total: total?.toFixed(2)?.toString(),
          updatedOn: updatedOn.toDate()?.toLocaleString("en-US", {
            timeZone: "America/Denver",
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        });
      });
      setOptions(invoices);
    }
  }, [invoiceData]);
  useEffect(() => {
    if (searchTerm?.id && router) {
      if (window.location.pathname === "/billing/")
        window.location.href = `/billing/invoice/?id=${searchTerm.id}`;
      else router.push(`/billing/invoice/?id=${searchTerm.id}`);
    }
  }, [searchTerm, router]);

  const Option: any = (props: any) => (
    <>
      <components.Option {...props}>
        <div className="flex flex-row items-center justify-between">
          <div>{props.children}</div>
          <div className="flex flex-row items-center justify-between">
            <div className="mx-4">
              <FontAwesomeIcon
                icon={faPaw}
                size="lg"
                className="text-movet-gray hover:text-movet-black ease-in-out duration-300 cursor-pointer"
                onClick={() =>
                  window.open(
                    `${PROVET_APP_BASE_URL}${PROVET_INVOICE_PATH}/${props?.data?.id}`,
                    "_blank",
                  )
                }
              />
            </div>
          </div>
        </div>
      </components.Option>
    </>
  );

  const formatOptionLabel = ({
    id,
    label,
    updatedOn,
  }: {
    id: string;
    label: string;
    updatedOn: string;
  }) => (
    <div className="flex flex-col">
      <p className="flex flex-row items-center text-lg">
        {label.includes("undefined") ? `Invoice #${id}` : label}{" "}
        {label.includes("undefined") ? (
          ""
        ) : (
          <span className="text-xs ml-2">({id})</span>
        )}
      </p>
      <p className="text-xs italic">{updatedOn}</p>
    </div>
  );
  const customFilter = (option: any, searchText: string) => {
    if (
      (option.data.label &&
        option.data.label.toLowerCase().includes(searchText.toLowerCase())) ||
      (option.data.id &&
        option.data.id.toLowerCase().includes(searchText.toLowerCase())) ||
      (option.data.payer_name &&
        option.data.total.toLowerCase().includes(searchText.toLowerCase())) ||
      (option.data.total &&
        option.data.total.toLowerCase().includes(searchText.toLowerCase()))
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      {error ? (
        <div className="px-8 pb-8">
          <Error
            error={{
              message:
                "User Search Error! " + error?.message || JSON.stringify(error),
            }}
          />
        </div>
      ) : (
        <div className="max-w-xl mx-auto mt-4 sm:mt-0 mb-8 z-50">
          <Select
            autoFocus
            isSearchable
            isClearable
            closeMenuOnSelect
            closeMenuOnScroll
            escapeClearsValue
            menuShouldScrollIntoView
            openMenuOnClick
            isLoading={loading}
            loadingMessage={() => "Loading Invoices..."}
            noOptionsMessage={() => "No Invoices Found..."}
            formatOptionLabel={formatOptionLabel}
            filterOption={customFilter}
            value={searchTerm}
            onChange={(value: any) => setSearchTerm(value)}
            options={options || []}
            placeholder="Search for an invoice by client name, or ID..."
            menuPosition="fixed"
            components={{ Option }}
            styles={{
              input: (base: any) => ({
                ...base,
                fontFamily: "Abside Smooth",
                borderWidth: 0,
                borderColor: "transparent",
                boxShadow: "none",
                "input:focus": {
                  boxShadow: "none",
                  borderWidth: 0,
                  borderColor: "transparent",
                },
                "input:hover": {
                  boxShadow: "none",
                  borderWidth: 0,
                  borderColor: "transparent",
                },
              }),
              control: (base: any) => ({
                ...base,
                boxShadow: "none",
                borderWidth: 0,
                borderColor: "transparent",
                fontFamily: "Abside Smooth",
              }),
              option: (base: any, state: any) => ({
                ...base,
                boxShadow: "none",
                fontWeight: state.isSelected ? "bold" : "normal",
                fontFamily: "Abside Smooth",
                color: state.isSelected ? "#f6f2f0" : "#232127",
                backgroundColor: state.isSelected ? "#E76159" : "transparent",
              }),
              singleValue: (base, state) =>
                ({
                  ...base,
                  borderWidth: 0,
                  borderColor: "transparent",
                  fontFamily: "Abside Smooth",
                  color: (state.data as any).color,
                }) as any,
              indicatorSeparator: (base: any) => ({
                ...base,
                backgroundColor: "#232127",
              }),
              dropdownIndicator: (base: any) => ({
                ...base,
                color: "#232127",
                ":hover": {
                  color: "#232127",
                },
              }),
            }}
            theme={(theme: any) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                danger: "#E76159",
                primary50: "#A15643",
                primary: "#232127",
              },
            })}
            className="search-input border-movet-black/50 relative border w-full bg-white rounded-xl py-2 text-left cursor-pointer sm:text-sm"
          />
        </div>
      )}
    </>
  );
};
