import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WarframeProvider } from '../../providers/warframe/warframe';
import { WarframeFactions, WarframeFactionCSS } from './../../lib/constants/constants';
import { GeneralUtils } from './../../lib/utils/general';
import { IGroupedInvasion } from '../../lib/interfaces/IGroupedInvasion';
import { Observable } from 'rxjs';

/**
 * Generated class for the InvasionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invasions',
  templateUrl: 'invasions.html',
})
export class InvasionsPage {

  warframeData: Observable<any>;
  userPlatform: string;
  invasions: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public warframeProvider: WarframeProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvasionsPage');
    this.warframeProvider.getPlatform().subscribe((platform) => {
      this.getWarframeData(platform);
    })

    // parse invasion data
    this.warframeData.subscribe((data) => {
      this.invasions = this.prepInvasionData(data.invasions || []);
    })
  }

  /**
   * gets the invasion faction css class name
   * @param faction 
   */
  getFactionCssClass(faction: string): string {
    let cssClass: string = '';

    switch (faction) {
      case WarframeFactions.corpus:
      cssClass = WarframeFactionCSS.corpus;
      break;

      case WarframeFactions.grineer:
      cssClass = WarframeFactionCSS.grineer;
      break;

      case WarframeFactions.infested:
      cssClass = WarframeFactionCSS.infested;
      break;
    }

    return cssClass;
  }

    /**
   * gets the style attribute data for an invasion faction
   * @param isAttacking 
   */
  getInvasionFactionStyle(completion: number, isAttacking:boolean): any {
    const percent: number = this.getInvasionCompletePercentage(completion, isAttacking);
    const float: string = isAttacking === true ? 'left' : 'right';

    return {
      'width': `${percent}%`,
      'float': `${float}`
    }
  }

  /**
   * gets the percentage value of the faction's invasion status
   * @param completion 
   * @param isAttacking 
   */
  getInvasionCompletePercentage(completion: number, isAttacking:boolean): number {
    const cmp = isAttacking === true ? completion : 100 - completion;
    return parseFloat(cmp.toFixed(1));
  }

   /**
   * get warframe data for interpolation on html page
   * @param platform 
   */
  getWarframeData(platform: any) {
    this.warframeData = this.warframeProvider.getData(platform);
  }

    /**
   * prepare invasions data
   * @param invasions 
   */
  prepInvasionData(invasions: any): Array<IGroupedInvasion> {
    return this.warframeProvider.parseInvasions(invasions);
  }

}
