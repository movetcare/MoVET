import { createContext } from 'react';
import { AnnouncementBanner } from 'types/AnnouncementBanner';

export const AnnouncementBannerContext = createContext({
  color: null,
  icon: null,
  title: null,
  message: null,
  link: null,
  isActive: false,
  announcementPreview: null,
  showAnnouncementPreview: false,
  setAnnouncementPreview: null,
  setShowAnnouncementPreview: null,
} as AnnouncementBanner | null);
