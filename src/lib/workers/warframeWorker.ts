
export class WarframeWorker {

    /**
     * This static function processes the request for warframeworkers
     * @param request 
     * @param callback 
     */
    public static processWorkerRequest(request: string, callback: (n: any) => void) {
        const message = JSON.parse(request);
        
        // this function needs to be contained inside the web worker function because the web worker function
        // cannot access anything outside of it's executing context
        const startAlertCountDown = (messageId: string, data: any, context: any, callback: (n: any) => void) => {
            let mins = data.mins || 0;
            let secs = data.secs || 60;
    
            const timer = setInterval(() => {
                if (mins == 0 && secs == 0) {
                    // clear interval event
                    clearInterval(timer);
    
                    // timer is done. post message
                    callback({
                        messageId: messageId,
                        data: { mins: mins, secs: secs, isComplete: true },
                        component: context,
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
                        messageId: messageId,
                        data: { mins: mins, secs: secs, isComplete: false },
                        component: context,
                        complete: false
                    });
                }
            }, 1000);
        }

        // call the actual function (internal function above) to calculate count down
        startAlertCountDown(
            message.messageId,
            message.data, 
            message.component, 
            callback);
    }
}