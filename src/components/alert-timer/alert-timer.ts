import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { isUndefined } from 'lodash';
/**
 * Generated class for the AlertTimerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alert-timer',
  templateUrl: 'alert-timer.html'
})
export class AlertTimerComponent implements OnChanges {

  public minutes: number;
  public seconds: number;
  private mins: string;
  private secs: string;


  @Input() eta: string;
  @Output() onCountdownFinished = new EventEmitter<boolean>();
  constructor() {
  }


  public ngOnChanges(changes: SimpleChanges) {
    if (!isUndefined(changes.eta.currentValue)) {
      this.setCountdownTimer(this.eta);
    }
  }

  /**
   * initializes the count down for the alert
   * based on the eta string passed in
   * @param eta // time b4 alert is un-available in the format "29m 35s"
   */
  public setCountdownTimer(eta: string) {

    if (!isUndefined(eta)) {

      const etaParsed: Array<string> = eta.split(' ');

      if (etaParsed !== null && etaParsed.length >= 1) {
        this.mins = undefined;
        this.secs = undefined;

        if (etaParsed.length >= 2) {
          this.mins =
            etaParsed[0] !== null && !isUndefined(etaParsed[0]) ?
              etaParsed[0].substring(0, (etaParsed[0].length - 1)) : this.mins;

          this.secs =
            etaParsed[1] !== null && !isUndefined(etaParsed[1]) ?
              etaParsed[1].substring(0, (etaParsed[1].length - 1)) : this.secs;
        }
        else {
          this.secs =
            etaParsed[0] !== null && !isUndefined(etaParsed[0]) ?
              etaParsed[0].substring(0, (etaParsed[0].length - 1)) : this.secs;
        }
      }

      this.timer(() => {
        this.onCountdownFinished.emit(true);
      },
        !isUndefined(this.mins) ? parseInt(this.mins) : 0,
        !isUndefined(this.secs) ? parseInt(this.secs) : 0);
    }
  }

  private timer(callback: () => any, mins: number, secs: number) {

    mins = mins || 0;
    secs = secs || 60;

    const timer = setInterval(() => {
      if (mins == 0 && secs == 0) {
        clearInterval(timer);
        callback();
      }

      if (secs <= 0) {
        mins--;
        secs = 59;
      }
      else {
        secs--;
      }

      this.minutes = mins;
      this.seconds = secs;

    }, 1000);
  }
}
