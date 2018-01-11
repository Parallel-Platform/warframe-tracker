/**
 * Generated class for the AlertTimerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { isUndefined } from 'lodash';
import { 
  WarframeProvider
} from '../../providers/warframe/warframe';
import {
  IAlertTime
} from './../../lib/interfaces';

@Component({
  selector: 'alert-timer',
  templateUrl: 'alert-timer.html'
})
export class AlertTimerComponent implements OnInit {

  public minutes: number;
  public seconds: number;
  private mins: string;
  private secs: string;


  @Input() eta: string;
  @Output() onCountdownFinished = new EventEmitter<boolean>();

  constructor(public warframeProvider: WarframeProvider) {
  }

  ngOnInit() {
    console.log('Alert timer loaded!');
    if (!isUndefined(this.eta) && this.eta !== null) {
      this.setCountdownTimer(this.eta);
    }
  }

  /*public ngOnChanges(changes: SimpleChanges) {
    if (!isUndefined(changes.eta.currentValue)) {
      this.setCountdownTimer(this.eta);
    }
  }*/

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

      const minutes = isUndefined(this.mins) ? 0 : parseInt(this.mins);
      const seconds = isUndefined(this.secs) ? 0 : parseInt(this.secs);

      // start count down nd subscribe to broadcats
      this.warframeProvider
        .startAlertTimer(minutes, seconds)
        .subscribe((alertTime: IAlertTime) => {
          // instantiate data-bound properties
          this.minutes = alertTime.mins;
          this.seconds = alertTime.secs;

          // check if count down is done
          if (alertTime.isComplete) {
            // broadcast event to parents
            this.onCountdownFinished.emit(true);
          }
        })
    }
  }

  /**
   * simple countdown timer which counts down the alert
   * @param callback // a callback which will be invoked when timer reaches 0
   * @param mins // minutes
   * @param secs // seconds
   */
  /*private timer(callback: () => any, mins: number, secs: number) {

    mins = mins || 0;
    secs = secs || 60;

    const timer = setInterval(() => {
      if (mins == 0 && secs == 0) {
        clearInterval(timer);
        callback();
      }
      else {
        if (secs <= 0) {
          mins--;
          secs = 59;
        }
        else {
          secs--;
        }

        // update property values for alert markup
        this.minutes = mins;
        this.seconds = secs;
      }
    }, 1000);
  }*/
}
