import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import environment from 'utils/environment';
import ReportABug from './ReportABug';

const Error = ({
  error,
}: {
  error: { code?: string; name?: string; message?: string } | any;
}) => (
  <div className="rounded-md bg-movet-red p-4 text-movet-white max-w-md mx-auto">
    <div className="flex justify-center items-center mb-8">
      <div className="flex-shrink-0">
        <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
      </div>
      <div className="ml-3">
        {environment === 'development' ? (
          <>
            <h3 className="text font-medium">
              {error?.name === 'FirebaseError'
                ? `Firebase Error: ${error?.code}`
                : error?.code
                ? `ERROR: ${error?.code.toUpperCase().replace('_', ' ')}`
                : 'Something Went Wrong...'}
            </h3>
            {error?.message && (
              <div className="text-sm">
                <p className="italic">{error?.message}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text font-medium">
              {error?.name === 'FirebaseError'
                ? `Server Error: ${error?.code}`
                : 'Something Went Wrong...'}
            </h3>
            {error?.message && error?.code !== 'permission-denied' ? (
              <div className="text-sm">
                <p>{error?.message}</p>
              </div>
            ) : (
              <div className="text-sm">
                <p>You do not have permission to access this information...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <ReportABug />
  </div>
);
export default Error;
