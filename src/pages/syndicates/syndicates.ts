import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { 
  WarframeProvider
} from '../../providers/warframe/warframe';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/filter';
import { SYNDICATES, SYNDICATE_CSS_CLASSES } from '../../lib/utils/constants';
/**
 * Generated class for the SyndicatesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-syndicates',
  templateUrl: 'syndicates.html',
})
export class SyndicatesPage {

  warframeData: Observable<any>;


  constructor(public navCtrl: NavController, public warframeProvider: WarframeProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyndicatesPage');
    this.warframeProvider.getPlatform().subscribe((platform) => {
      this.getWarframeData(platform);
    })
  }

  /**
   * get warframe data for interpolation on html page
   * @param platform 
   */
  getWarframeData(platform: any) {
    this.warframeData = this.warframeProvider
      .getData(platform)
      .filter(data => {
        data.syndicateMissions = data.syndicateMissions.map(mission => {
          mission.nodes = mission.nodes.filter(node => mission.nodes.length - (mission.nodes.lastIndexOf(node) + 1) < 3)
          return mission;
        });
        return data;
      });
  }

  /**
   * Gets the css class for a syndicate
   * @param syndicate 
   */
  getSyndicateCssClass(syndicate: string): string {
    return SYNDICATE_CSS_CLASSES.find(css => css.name === syndicate).cssClass;
  }

  getSyndicateImage(syndicate: string): string {
    return this.warframeProvider.loadSyndicateImageUrl(syndicate);
  }

  /**
   * makes sure it is one of the six applicable syndicates
   * @param name 
   */
  isApplicableSyndicate(name: string): boolean {
    const syndicates = Object.keys(SYNDICATES).map(key => SYNDICATES[key]);
    const match = syndicates.find(syn => syn === name);
    return match !== undefined;
  }

  isLastThreeSyndicateNode(node: string, nodes: any[]): boolean {
    return nodes.length - (nodes.lastIndexOf(node) + 1) < 3;
  }

}
