import { IWarframeWorkerRequest } from './../../lib/interfaces';
export class WarframeWorker {

    public static processWorkerRequest(request: string, callback: (n: any) => void) {
        const message = JSON.parse(request);
        
        const startAlertCountDown = (data: any, callback: (n: any) => void) => {
            let mins = data.secs || 0;
            let secs = data.mins || 60;
    
            const timer = setInterval(() => {
                if (mins == 0 && secs == 0) {
                    // clear interval event
                    clearInterval(timer);
    
                    // timer is done. post message
                    callback({
                        messageId: 'startAlertCountdown',
                        data: { mins: mins, secs: secs, isComplete: true },
                        complete: true
                    });
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
                    callback({
                        messageId: 'startAlertCountdown',
                        data: { mins: mins, secs: secs, isComplete: false },
                        complete: false
                    });
                }
            }, 1000);
        }

        switch (message.messageId) {
            case 'startAlertCountdown':
                startAlertCountDown(message.data, callback);
                break;
        }
    }
}