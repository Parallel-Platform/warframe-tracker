import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvasionsPage } from './invasions';

@NgModule({
  declarations: [
    InvasionsPage,
  ],
  imports: [
    IonicPageModule.forChild(InvasionsPage),
  ],
})
export class InvasionsPageModule {}
