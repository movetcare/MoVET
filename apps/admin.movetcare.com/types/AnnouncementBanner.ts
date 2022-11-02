type Colors =
  | '#DAAA00'
  | '#2C3C72'
  | '#E76159'
  | '#232127'
  | '#00A36C'
  | '#A15643'
  | null;

type Icons =
  | 'exclamation-circle'
  | 'bullhorn'
  | 'bell'
  | 'star'
  | 'info-circle'
  | null;

export interface AnnouncementBanner {
  color: Colors;
  icon: Icons;
  title: string | null;
  message: string | null;
  link: string | null;
  isActive: boolean;
  updatedOn?: Date;
  announcementPreview: AnnouncementBannerPreview | null;
  showAnnouncementPreview: boolean;
  setShowAnnouncementPreview?: any;
  setAnnouncementPreview?: any;
}

export interface AnnouncementBannerPreview {
  color: Colors;
  icon: Icons;
  title: string | null;
  message: string | null;
  link: string | null;
  isActive: boolean;
}
