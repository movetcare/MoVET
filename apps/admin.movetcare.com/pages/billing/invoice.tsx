import { doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from 'services/firebase';
import Error from 'components/Error';
import { useEffect, useState } from 'react';
import { Loader } from "ui";
import { InvoiceTitle } from 'components/invoice/detail/InvoiceTitle';
import { InvoiceRemarks } from 'components/invoice/detail/InvoiceRemarks';
import { InvoiceItems } from 'components/invoice/detail/InvoiceItems';

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
    doc(firestore, `client_invoices/${id}`)
  );
  const [counterSale, loadingCounterSale, errorCounterSale] = useDocument(
    doc(firestore, `counter_sales/${id}`)
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
    <Loader />
  ) : errorClientInvoice || errorCounterSale ? (
    <Error error={errorClientInvoice || errorCounterSale} />
  ) : (
    <>
      <div className="sm:my-8 flex flex-col w-full justify-center items-center text-large text-movet-black sm:max-w-md border-movet-gray sm:rounded-xl bg-white sm:mx-auto p-8 drop-shadow-2xl">
        <InvoiceTitle
          id={invoice?.id}
          isClientInvoice={isClientInvoice}
          isPaid={invoice?.client_due_sum === 0}
          lastUpdated={invoice?.updatedOn?.toDate()}
        />
        <InvoiceRemarks remarks={invoice?.remarks} />
        <InvoiceItems id={invoice?.id} isClientInvoice={isClientInvoice} />
        {/* <div className="flex flex-col w-full mx-auto italic">
          <div className="flex flex-row justify-between items-center mt-4 text-sm">
            <h3>Subtotal</h3>
            <p>$72.95</p>
          </div>
          <div className="flex flex-row justify-between items-center border-b p-2 mb-2 text-sm">
            <h3>Tax</h3>
            <p>$0.00</p>
          </div>
          <div className="flex flex-row justify-between items-center mt-0 text-sm">
            <h3>Total</h3>
            <p>$72.95</p>
          </div>
          <div className="rounded-md bg-movet-red p-4 text-movet-white mt-6">
            <div className="flex flex-row justify-center items-center text-base">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="hand-holding-dollar"
                className="svg-inline--fa fa-hand-holding-dollar fa-2x "
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  fill="currentColor"
                  d="M568.2 336.3c-13.12-17.81-38.14-21.66-55.93-8.469l-119.7 88.17h-120.6c-8.748 0-15.1-7.25-15.1-15.99c0-8.75 7.25-16 15.1-16h78.25c15.1 0 30.75-10.88 33.37-26.62c3.25-20-12.12-37.38-31.62-37.38H191.1c-26.1 0-53.12 9.25-74.12 26.25l-46.5 37.74L15.1 383.1C7.251 383.1 0 391.3 0 400v95.98C0 504.8 7.251 512 15.1 512h346.1c22.03 0 43.92-7.188 61.7-20.27l135.1-99.52C577.5 379.1 581.3 354.1 568.2 336.3zM279.3 175C271.7 173.9 261.7 170.3 252.9 167.1L248 165.4C235.5 160.1 221.8 167.5 217.4 179.1s2.121 26.2 14.59 30.64l4.655 1.656c8.486 3.061 17.88 6.095 27.39 8.312V232c0 13.25 10.73 24 23.98 24s24-10.75 24-24V221.6c25.27-5.723 42.88-21.85 46.1-45.72c8.688-50.05-38.89-63.66-64.42-70.95L288.4 103.1C262.1 95.64 263.6 92.42 264.3 88.31c1.156-6.766 15.3-10.06 32.21-7.391c4.938 .7813 11.37 2.547 19.65 5.422c12.53 4.281 26.21-2.312 30.52-14.84s-2.309-26.19-14.84-30.53c-7.602-2.627-13.92-4.358-19.82-5.721V24c0-13.25-10.75-24-24-24s-23.98 10.75-23.98 24v10.52C238.8 40.23 221.1 56.25 216.1 80.13C208.4 129.6 256.7 143.8 274.9 149.2l6.498 1.875c31.66 9.062 31.15 11.89 30.34 16.64C310.6 174.5 296.5 177.8 279.3 175z"
                ></path>
              </svg>
              <h3 className="ml-2 font-medium text-center text-lg">
                AMOUNT DUE - $<span className="font-bold">72.95</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row mt-8">
            <a
              href="https://us.provetcloud.com/4285/billing/invoice/265"
              target="_blank"
              rel="noreferrer"
              className="mr-2 flex flex-row bg-movet-white group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-green hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
            >
              <span className="mr-2">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="money-bill-1"
                  className="svg-inline--fa fa-money-bill-1 fa-lg "
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M252 208C252 196.1 260.1 188 272 188H288C299 188 308 196.1 308 208V276H312C323 276 332 284.1 332 296C332 307 323 316 312 316H264C252.1 316 244 307 244 296C244 284.1 252.1 276 264 276H268V227.6C258.9 225.7 252 217.7 252 208zM512 64C547.3 64 576 92.65 576 128V384C576 419.3 547.3 448 512 448H64C28.65 448 0 419.3 0 384V128C0 92.65 28.65 64 64 64H512zM128 384C128 348.7 99.35 320 64 320V384H128zM64 192C99.35 192 128 163.3 128 128H64V192zM512 384V320C476.7 320 448 348.7 448 384H512zM512 128H448C448 163.3 476.7 192 512 192V128zM288 144C226.1 144 176 194.1 176 256C176 317.9 226.1 368 288 368C349.9 368 400 317.9 400 256C400 194.1 349.9 144 288 144z"
                  ></path>
                </svg>
              </span>
              Pay w/ CASH
            </a>
            <button
              type="button"
              className="mt-4 sm:mt-0 ml-0 sm:ml-2 flex flex-row bg-movet-white group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-black hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
            >
              <span className="mr-2">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="credit-card"
                  className="svg-inline--fa fa-credit-card fa-lg "
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M512 32C547.3 32 576 60.65 576 96V128H0V96C0 60.65 28.65 32 64 32H512zM576 416C576 451.3 547.3 480 512 480H64C28.65 480 0 451.3 0 416V224H576V416zM112 352C103.2 352 96 359.2 96 368C96 376.8 103.2 384 112 384H176C184.8 384 192 376.8 192 368C192 359.2 184.8 352 176 352H112zM240 384H368C376.8 384 384 376.8 384 368C384 359.2 376.8 352 368 352H240C231.2 352 224 359.2 224 368C224 376.8 231.2 384 240 384z"
                  ></path>
                </svg>
              </span>
              Pay w/ CARD
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Invoice;
