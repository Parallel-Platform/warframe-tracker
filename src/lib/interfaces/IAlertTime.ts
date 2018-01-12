export interface IAlertTime
{
  instanceId: string;
  secs: number;
  mins?: number;
  hours?: number;
  days?: number;
  isComplete?: boolean
  component?: any
};