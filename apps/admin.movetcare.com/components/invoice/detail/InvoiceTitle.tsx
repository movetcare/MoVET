import { faLink, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PROVET_APP_BASE_URL, PROVET_INVOICE_PATH } from 'constants/urls';
import { useRouter } from 'next/router';
import environment from 'utils/environment';
import { timeSince } from 'utils/timeSince';

export const InvoiceTitle = ({
  isClientInvoice,
  isPaid,
  id,
  lastUpdated,
}: {
  isClientInvoice: boolean;
  isPaid: boolean;
  id: number;
  lastUpdated: Date;
}) => {
  const router = useRouter();
  if (environment !== 'production')
    console.log('InvoiceTitle Props', {
      isClientInvoice,
      isPaid,
      id,
      lastUpdated,
    });
  return (
    <>
      <h2 className="my-0 text-xl">
        {isPaid ? 'PAID' : 'UNPAID'}
        {isClientInvoice ? ' Client Invoice' : ' Counter Sale'}
        {id && ` - #${id}`}
        {id && router?.query?.mode !== 'embed' && (
          <a
            href={`${PROVET_APP_BASE_URL + PROVET_INVOICE_PATH}/${id}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 hover:underline ease-in-out duration-500 hover:text-movet-red"
          >
            <FontAwesomeIcon icon={isPaid ? faLink : faEdit} size="xs" />
          </a>
        )}
      </h2>
      {lastUpdated && (
        <p className="flex flex-rows items-center text-xs mb-4">
          Updated
          <time dateTime={lastUpdated.toString()} className="ml-1">
            {timeSince(lastUpdated)}
          </time>
        </p>
      )}
    </>
  );
};
