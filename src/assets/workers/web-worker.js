const self = this;

self.addEventListener('message', self.processMessage, false);

self.messageIds = {
    startAlertCountdown: 'startAlertCountdown'
};

self.processMessage = (message) => {
    // get mesageId & data
    const parsedMessage = JSON.parse(message);
    const messageId = _.get(parsedMessage, 'messageId', null);
    const data = _.get(parsedMessage, 'data', null);

    // determine which web worker method is called
    if (messageId !== null) {
        switch (messageId) {
            // Alert timer count down
            case self.messageIds.startAlertCountdown:
                self.startAlertCountdown(data);
                break;
        }
    }
}

/**
 * web worker method which stars a countdown from min/secs passed in
 * @param {*} data 
 */
self.startAlertCountdown = (data) => {
    let mins = _.get(data, 'secs', 0);
    let secs = _.get(data, 'mins', 60);

    const timer = setInterval(() => {
        if (mins == 0 && secs == 0) {
            // clear interval event
            clearInterval(timer);

            // timer is done. post message
            self.postMessage(JSON.stringify(
                {
                    messageId: self.messageIds.startAlertCountdown,
                    data: { mins: mins, secs: secs },
                    complete: true
                }
            ));
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
            self.postMessage(JSON.stringify(
                {
                    messageId: self.messageIds.startAlertCountdown,
                    data: { secs: secs, mins: mins },
                    complete: false
                }
            ));
        }
    }, 1000);
}