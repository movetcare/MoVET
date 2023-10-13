import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";
import { AnnouncementBanner } from "types/AnnouncementBanner";

export const useAnnouncementBanner = ({ mode }: { mode: "web" | "mobile" }) => {
  const [announcementOptions, loading, error] = useDocument(
    doc(firestore, "alerts", mode === "web" ? `banner_${mode}` : "banner"),
  );
  const [announcement, setAnnouncement] = useState<null | AnnouncementBanner>(
    null,
  );
  const [showAnnouncementPreview, setShowAnnouncementPreview] =
    useState<boolean>(false);
  const [announcementPreview, setAnnouncementPreview] =
    useState<AnnouncementBanner | null>(null);

  useEffect(() => {
    if (announcementOptions !== undefined) {
      setAnnouncement(announcementOptions.data() as AnnouncementBanner);
    }
  }, [announcementOptions, loading, error]);
  return {
    announcement,
    showAnnouncementPreview,
    setShowAnnouncementPreview,
    setAnnouncementPreview,
    announcementPreview,
    loading,
    error,
  };
};
