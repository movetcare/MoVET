export type PopUpAd = {
  icon: any;
  title: string;
  autoOpen: boolean;
  isActive?: boolean;
  description: string;
  link?: string;
  ignoreUrlPath?: string;
  imagePath?: string;
  height?: number;
  width?: number;
  adComponent?: any;
  popUpClinics?: Array<{
    name: string;
    id: string;
    schedule: {
      date: any;
      startTime: number;
      endTime: number;
    };
  }>;
};
