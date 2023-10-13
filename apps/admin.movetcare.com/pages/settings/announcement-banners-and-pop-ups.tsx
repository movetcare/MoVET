import AdminCheck from "components/AdminCheck";
import { MobileAnnouncementBannerControls } from "components/MobileAnnouncementBannerControls";
import { WebAnnouncementBannerControls } from "components/WebAnnouncementBannerControls";
import { WebPopUpAdControls } from "components/WebPopUpAdControls";
const AnnouncementBanner = () => (
  <AdminCheck>
    <div className="flex flex-col lg:flex-row">
      <div className="lg:pr-2">
        <MobileAnnouncementBannerControls />
      </div>
      <div className="lg:px-2">
        <WebAnnouncementBannerControls />
      </div>
      <div className="lg:pl-2">
        <WebPopUpAdControls />
      </div>
    </div>
  </AdminCheck>
);

export default AnnouncementBanner;
