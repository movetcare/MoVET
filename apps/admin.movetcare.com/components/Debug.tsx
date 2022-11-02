import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import JsonFormatter from 'react-json-formatter';
import Button from './Button';

export const DEBUG = ({ show, json }: { show: boolean; json: object }) => {
  const jsonStyle = {
    propertyStyle: { color: 'red' },
    stringStyle: { color: 'green' },
    numberStyle: { color: 'darkorange' },
  };

  return show ? (
    <JsonFormatter
      json={JSON.stringify(json)}
      tabWith={4}
      jsonStyle={jsonStyle}
    />
  ) : (
    <></>
  );
};

export const DEBUG_TOGGLE = ({
  showDebug,
  setShowDebug,
}: {
  showDebug: boolean;
  setShowDebug: any;
}) => {
  return (
    <Button onClick={() => setShowDebug(!showDebug)} color="black">
      <span className="flex-shrink-0 cursor-pointer mr-2">
        <FontAwesomeIcon icon={faBug} size="lg" />
      </span>
      {showDebug ? 'HIDE ' : 'SHOW '}Debug Info
    </Button>
  );
};
