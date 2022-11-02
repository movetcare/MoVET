export type Shift = {
  id: number;
  start: Date;
  end: Date;
  user: number;
  department: number;
  ward: null | string;
  team: null | string;
  shiftType: number;
  web: boolean;
  note: string;
  isSlot: boolean;
};
