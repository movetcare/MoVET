export type ClinicConfig = {
  name: string;
  description: string;
  zipcode: string;
  address: string;
  addressInfo: string;
  addressLatLon: null | {
    lat: number;
    lng: number;
  };
  placeId: string;
  remoteLocation: boolean;
  id: string;
  isActive: boolean;
  reason: string;
  appointmentBufferTime: number;
  vcprRequired: boolean;
  appointmentDuration: number;
  scheduleType: "ONCE";
  schedule: {
    date?: any;
    startTime?: number;
    endTime?: number;
  };
  resourceConfiguration: Array<{
    id: number;
    staggerTime: number;
  }>;
  isTestClinic?: boolean;
};
