import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyndicatesPage } from './syndicates';

@NgModule({
  declarations: [
    SyndicatesPage,
  ],
  imports: [
    IonicPageModule.forChild(SyndicatesPage),
  ],
})
export class SyndicatesPageModule {}
