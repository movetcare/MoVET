import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const InvoiceRemarks = ({ remarks }: { remarks: string }) => {
  return remarks ? (
    <div className="bg-movet-white border-l-4 border-movet-black p-4 mb-2 w-full">
      <div className="flex flex-row items-center">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faInfoCircle} size="lg" />
        </div>
        <div className="ml-3">
          <p className="text-sm">{remarks}</p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
