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
  private instanceId: string;


  @Input() eta: string;
  @Output() onCountdownFinished = new EventEmitter<boolean>();

  constructor(public warframeProvider: WarframeProvider) {
    // generate random string for this component's instanceId
    this.instanceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  ngOnInit() {
    console.log('Alert timer loaded!');
    if (!isUndefined(this.eta) && this.eta !== null) {
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

      const minutes = isUndefined(this.mins) ? 0 : parseInt(this.mins);
      const seconds = isUndefined(this.secs) ? 0 : parseInt(this.secs);

      // start count down and subscribe to broadcast
      this.warframeProvider
        .startAlertTimer(this.instanceId, minutes, seconds)
        .subscribe((alertTime: IAlertTime) => {

          if (alertTime.instanceId === this.instanceId) {
            // instantiate data-bound properties
            this.minutes = alertTime.mins;
            this.seconds = alertTime.secs;

            // check if count down is done
            if (alertTime.isComplete) {
              // broadcast event to parents
              this.onCountdownFinished.emit(true);
            }
          }
        })
    }
  }
}
