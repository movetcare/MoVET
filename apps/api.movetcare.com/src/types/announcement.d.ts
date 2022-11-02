export type Announcement = {
  color:
    | "#DAAA00"
    | "#2C3C72"
    | "#E76159"
    | "#232127"
    | "#00A36C"
    | "#A15643"
    | null;
  icon:
    | "exclamation-circle"
    | "bullhorn"
    | "bell"
    | "star"
    | "info-circle"
    | null;
  title: string | null;
  message: string | null;
  link: string | null;
  isActive: boolean;
  updatedOn: Date;
};
