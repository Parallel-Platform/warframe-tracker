/**
 * Description: Provider class for Warframe data
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { 
  isUndefined, 
  uniq,
  forEach 
} from 'lodash';
import * as WarframeWorldStateParser from 'warframe-worldstate-parser';
import { ImageConstants } from './../../lib/constants/constants';
import { IGroupedInvasion } from './../../lib/interfaces/IGroupedInvasion';

/*
  Generated class for the WarframeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WarframeProvider {

  private warframeSubject = new BehaviorSubject<any>({});
  private platformSubject = new BehaviorSubject<string>('pc');

  private urls: any = {
    ps4: 'warframe/api/ps4',
    xbox1: 'warframe/api/xbox',
    pc: 'warframe/api/pc'
  };

  constructor(public http: Http, public storage: Storage) {
    this._getUserPlatform();
    this._init(http, storage);
  }

  private _getWarframeData(platform) {
    return this.http.get(this.urls[platform || 'pc'])
      .map(res => res.text());
  }

  private _getUserPlatform() {
    this.storage.get('warframe_platform').then((platform) => {
      if(platform){ 
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
    const img =  alert.mission.reward.thumbnail.substring(slashIndex);

    switch (img) {
      case ImageConstants.warningImage:
        return '../assets/img/Credits.png';

      default:
        return alert.mission.reward.thumbnail;
    }
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

    // get list of invasion planets
    const nodes = invasions.map((invasion) => {
      return invasion.node.toString().substring(invasion.node.toString().indexOf('('));
    });

    // create a grouped invasions object
    const groupedInvasions: any = {};

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
        invasions: invasionData
      };

      results.push(groupedInvasion);
    });

    return results;
  }

  /**
   * refreshes the world state data from warframe
   */
  refreshWorldState() {
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

}
