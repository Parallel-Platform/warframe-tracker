export interface IWarframeWorkerRequest
{
  messageId: string;
  workerFunction?: any;
  data: any;
};

export interface IWarframeWorkerResponse extends IWarframeWorkerRequest
{
  complete: boolean;
};