import { IAlertTime, IWarframeWorkerResponse } from './../../lib/interfaces';
import { WorkerMessageIds } from './../../lib/constants/constants';
export class AlertTimerWorker {

    public static startAlertCountDown(data: IAlertTime, callback: (n: IWarframeWorkerResponse) => void) {
        let mins = data.secs || 0;
        let secs = data.mins || 60;

        const timer = setInterval(() => {
            if (mins == 0 && secs == 0) {
                // clear interval event
                clearInterval(timer);

                // timer is done. post message
                callback(
                    {
                        messageId: WorkerMessageIds.startAlertCountdown,
                        component: {},
                        data: { mins: mins, secs: secs, isComplete: true },
                        complete: true
                    }
                );
            }
            else {
                // decrement mins & secs values
                if (secs <= 0) {
                    mins--;
                    secs = 59;
                }
                else {
                    secs--;
                }

                // send response to listeners
                callback(
                    {
                        messageId: WorkerMessageIds.startAlertCountdown,
                        component: {},
                        data: { mins: mins, secs: secs, isComplete: false },
                        complete: false
                    }
                );
            }
        }, 1000);
    }
}