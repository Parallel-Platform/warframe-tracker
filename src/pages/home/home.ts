import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { 
  WarframeProvider
} from '../../providers/warframe/warframe';
import { Observable } from 'rxjs';
import { IGroupedInvasion } from '../../lib/interfaces/IGroupedInvasion';

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
}
