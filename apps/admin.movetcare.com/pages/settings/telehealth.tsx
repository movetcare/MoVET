import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import "react-tooltip/dist/react-tooltip.css";
import { useDocument } from "react-firebase-hooks/firestore";
import AdminCheck from "components/AdminCheck";
import { doc } from "firebase/firestore";
import { TelehealthChatTemplates } from "components/settings/TelehealthChatTemplates";

const Telehealth = () => {
  const [onlineTemplates, setOnlineTemplates] = useState<Array<{
    message: string;
    title: string;
  }> | null>(null);
  const [offlineTemplates, setOfflineTemplates] = useState<Array<{
    message: string;
    title: string;
  }> | null>(null);

  const [templates, loadingTemplates, errorTemplates] = useDocument(
    doc(firestore, "configuration/telehealth"),
  );

  useEffect(() => {
    if (templates && templates?.data()) {
      setOnlineTemplates(templates?.data()?.onlineTemplates);
      setOfflineTemplates(templates?.data()?.offlineTemplates);
    }
  }, [templates]);

  return (
    <AdminCheck>
      <TelehealthChatTemplates
        mode="online"
        templates={onlineTemplates}
        loading={loadingTemplates}
        error={errorTemplates}
      />
      <TelehealthChatTemplates
        mode="offline"
        templates={offlineTemplates}
        loading={loadingTemplates}
        error={errorTemplates}
      />
    </AdminCheck>
  );
};

export default Telehealth;
