import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SortiesPage } from './sorties';

@NgModule({
  declarations: [
    SortiesPage,
  ],
  imports: [
    IonicPageModule.forChild(SortiesPage),
  ],
})
export class SortiesPageModule {}
