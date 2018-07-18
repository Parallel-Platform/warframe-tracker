import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertsPage } from './alerts';
import { AlertTimerComponent } from '../../components/alert-timer/alert-timer';

@NgModule({
  declarations: [
    AlertsPage,
    AlertTimerComponent
  ],
  imports: [
    IonicPageModule.forChild(AlertsPage),
  ],
})
export class AlertsPageModule {}
