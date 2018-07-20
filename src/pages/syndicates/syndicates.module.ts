import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyndicatesPage } from './syndicates';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SyndicatesPage
  ],
  imports: [
    IonicPageModule.forChild(SyndicatesPage),
    ComponentsModule
  ],
})
export class SyndicatesPageModule {}
