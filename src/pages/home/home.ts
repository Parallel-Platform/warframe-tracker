import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { 
  WarframeProvider
} from '../../providers/warframe/warframe';
import { Observable } from 'rxjs';
import { IGroupedInvasion } from '../../lib/interfaces/IGroupedInvasion';
import { WarframeFactions, WarframeFactionCSS } from './../../lib/constants/constants';
import { GeneralUtils } from './../../lib/utils/general';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  warframeData: Observable<any>;
  userPlatform: string;

  constructor(public navCtrl: NavController, public warframeProvider: WarframeProvider) {
  }

  /* Life cycle events */
  ionViewDidLoad() {
    console.log('Home page loaded!');
    this.warframeProvider.getPlatform().subscribe((platform) => {
      this.getWarframeData(platform);
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
    const cmp = isAttacking === true ? Math.abs(completion) : (1 - Math.abs(completion));
    const percent: number = this.getInvasionPercent(cmp); 
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
    const cmp = isAttacking === true ? Math.abs(completion) : (1 - Math.abs(completion));
    return this.getInvasionPercent(cmp);
  }

  getImageUrl(alert: any): string {
    // alert.mission.reward.thumbnail
    return this.warframeProvider.loadAlertItemUrl(alert);
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

  private getInvasionPercent(completion: number): number {
    return  GeneralUtils.roundToPrecision(Math.abs(completion), 1) * 100;
  }
}
