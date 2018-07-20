/**
 * Description: Provider class for Warframe data
 */
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { createWorker, ITypedWorker } from 'typed-web-workers';
import 'rxjs/add/operator/map';
import {
  isUndefined,
  forEach
} from 'lodash';
import * as WarframeWorldStateParser from 'warframe-worldstate-parser';
import { ImageConstants } from './../../lib/constants/constants';
import {
  IGroupedInvasion,
  IAlertTime,
  IWarframeWorkerResponse
} from './../../lib/interfaces';
import { WarframeWorker } from './../../lib/workers/warframeWorker';
import { SYNDICATE_IMAGES } from './../../lib/utils/constants';

/*
  Generated class for the WarframeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WarframeProvider {

  private warframeSubject = new BehaviorSubject<any>({});
  private platformSubject = new BehaviorSubject<string>('pc');
  private countdownTime = new BehaviorSubject<IAlertTime>({
    instanceId: '',
    secs: 0,
    mins: 0,
    hours: 0,
    days: 0,
    isComplete: false
  });

  private typedWorker: ITypedWorker<any, any>

  private urls: any = {
    ps4: 'warframe/api/ps4',
    xbox1: 'warframe/api/xbox',
    pc: 'warframe/api/pc'
  };

  constructor(public http: Http, public storage: Storage, public ngZone: NgZone) {
    this._getUserPlatform();
    this._init(http, storage);


    this.typedWorker = createWorker(WarframeWorker.processWorkerRequest, this.updateAlertTime.bind(this));
  }

  private _getWarframeData(platform) {
    return this.http.get(this.urls[platform || 'pc'])
      .map(res => res.text());
  }

  private _getUserPlatform() {
    this.storage.get('warframe_platform').then((platform) => {
      if (platform) {
        this.platformSubject.next(platform);
      }
    })
  }

  private _init(http: Http, storage: Storage) {
    //set the default state of the behavior subject store i.e. get warframe data
    this.getPlatform().subscribe((platform) => {

      if (platform) {
        //set the behavior subject with our data
        this._getWarframeData(platform).subscribe((rawData) => {
          if (rawData) {
            console.log(`raw data: ${JSON.parse(rawData)}`);
            const parsedData = new WarframeWorldStateParser(rawData);
            console.log(parsedData);
            this.warframeSubject.next(parsedData || {});
          }
        });
      }
    })
  }

  /**
   * gets warframe worldstate for platform. defaults to pc if no platform passed in
   * @param platform 
   */
  public getData(platform): Observable<any> {
    return this.warframeSubject.asObservable();
  }

  /**
   * gets the user's platform. returns 'pc' if not set
   * @return Observable<string>
   */
  public getPlatform(): Observable<string> {
    return this.platformSubject.asObservable();
  }

  /**
   * gets the image url (or a default) for an alert reward
   * @param alert 
   */
  public loadAlertItemUrl(alert: any): string {

    // return an empty string if alert is nothing
    if (alert === null || isUndefined(alert)) {
      return '';
    }

    const slashIndex = alert.mission.reward.thumbnail.lastIndexOf('/') + 1;
    const img = alert.mission.reward.thumbnail.substring(slashIndex);

    switch (img) {
      case ImageConstants.warningImage:
        return '../assets/img/Credits.png';

      default:
        return alert.mission.reward.thumbnail;
    }
  }

  /**
   * gets image url for syndicate faction
   * @param syndicate 
   */
  public loadSyndicateImageUrl(syndicate: string): string {
    return SYNDICATE_IMAGES.find(img => img.name === syndicate).url;
  }

  /**
   * parse the list of invasions - grouping them by planet (node)
   * @param invasions 
   */
  public parseInvasions(invasions: Array<any>): Array<IGroupedInvasion> {

    const results: Array<IGroupedInvasion> = [];

    if (invasions === null || isUndefined(invasions)) {
      return results;
    }

    // create a grouped invasions object
    const groupedInvasions: any = {};

    invasions = invasions.filter(invasion => invasion.completed !== true);

    invasions.map((invasion) => {
      const start = invasion.node.toString().indexOf('(');
      const end = invasion.node.toString().indexOf(')');

      // get the planet listed for the invasion
      const node = invasion.node.toString().substring(start, (end + 1));

      // groupedInvasions is an object literal with properties that are arrays.
      if (groupedInvasions[node] !== null && !isUndefined(groupedInvasions[node])) {
        groupedInvasions[node].push(invasion);
      }
      else {
        groupedInvasions[node] = [invasion];
      }
    });

    forEach(groupedInvasions, (invasionData, planet) => {
      const groupedInvasion: IGroupedInvasion = {
        planet: planet.replace('(', '').replace(')', ''),
        summary: this.getNodeInvasionSummary(invasionData),
        invasions: invasionData
      };

      results.push(groupedInvasion);
    });

    return results;
  }

  public parseSyndicateData(syndicateMissions: any[]) {
    
  }

  /**
   * refreshes the world state data from warframe
   */
  public refreshWorldState() {
    this._init(this.http, this.storage);
  }

  /**
   * Sets the user's set platform (XB1 | PS4 | PC)
   * @param platform 
   */
  public setPlatform(platform) {
    this.storage.set('warframe_platform', platform);
    this.platformSubject.next(platform);
  }

  /**
   * 
   * @param mins 
   * @param secs 
   */
  public startAlertTimer(id: string, hrs: number, mins: number, secs: number): Observable<IAlertTime> {

    // send a message to the web-worker to start the count down
    // message --> { message_id: string, data: IAlertTime }
    this.typedWorker.postMessage(JSON.stringify({
      messageId: id,
      data: { secs: secs, mins: mins, hrs: hrs }
    }));

    // return the behavior subject as an observable
    return this.countdownTime.asObservable();
  }

  private getNodeInvasionSummary(nodes: Array<any>) {
    // take the average of all opposing nodes and return them
    let sum = 0;

    sum = nodes.reduce((acc: number, node) => {
      return acc + node.completion;
    }, sum);

    // determine if completed
    return {
      completion: sum / nodes.length,
      completed: nodes.every((node) => node.completed === true),
      desc: this.getInvasionSummaryDescription(nodes),
      attackingFaction: nodes.length >= 1 ? nodes[0].attackingFaction : 'N/A',
      defendingFaction: nodes.length >= 1 ? nodes[0].defendingFaction : 'N/A'
    }
  }

  private getInvasionSummaryDescription(nodes: any[]): string {
    let desc = '';
    if (nodes.length > 2) {
      // find out which description has the highest occuring frequency
      const matches: any =  {};
      nodes.forEach(node => {
        if (matches[node.desc] === undefined || matches[node.desc] === null) {
          matches[node.desc] = 1;
        }
        else {
          matches[node.desc] += 1;
        }
      });

      // get the 'desc' with the highest frequency
      desc = Object.keys(matches).reduce((a, b) => matches[a] > matches[b] ? a : b);

    }
    else {
      desc = nodes.length > 0 ? nodes[nodes.length - 1].desc : '';
    }
    return desc;
  }

  private updateAlertTime(message: IWarframeWorkerResponse) {
    this.ngZone.run(() => {
      // get curr alert time from behavior subject
      const countdownTime = this.countdownTime.getValue();

      const alertTime: IAlertTime = {
        instanceId: message.messageId,
        secs: message.data.secs,
        mins: message.data.mins,
        hours: message.data.hrs,
        days: countdownTime.days,
        isComplete: message.complete
      };

      // broadcast new values to subscribers
      this.countdownTime.next(alertTime);
    })
  }

}
