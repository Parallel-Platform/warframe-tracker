import { Component } from '@angular/core';
import { AlertsPage } from '../alerts/alerts';
import { EventsPage } from '../events/events';
import { FissuresPage } from '../fissures/fissures';
import { InvasionsPage } from '../invasions/invasions';
import { SortiesPage } from '../sorties/sorties';
import { SyndicatesPage } from '../syndicates/syndicates';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public alertsTab = AlertsPage;
  public eventsTab = EventsPage;
  public fissuresTab = FissuresPage;
  public invasionsTab = InvasionsPage;
  public sortiesTab = SortiesPage;
  public syndicatesTab = SyndicatesPage;
  

  constructor() {

  }
}
