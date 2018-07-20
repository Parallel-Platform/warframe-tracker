import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { 
  WarframeProvider
} from '../../providers/warframe/warframe';
import { Observable } from 'rxjs';
/*import { WarframeFactions, WarframeFactionCSS } from './../../lib/constants/constants';
import { GeneralUtils } from './../../lib/utils/general';*/

/**
 * Generated class for the AlertsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alerts',
  templateUrl: 'alerts.html',
})
export class AlertsPage {

  warframeData: Observable<any>;
  userPlatform: string;

  constructor(public navCtrl: NavController, public warframeProvider: WarframeProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertsPage');
    this.warframeProvider.getPlatform().subscribe((platform) => {
      this.getWarframeData(platform);
    })
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

}
