import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';


import { AlertsPageModule } from '../pages/alerts/alerts.module';
import { EventsPageModule } from '../pages/events/events.module';
import { FissuresPageModule } from '../pages/fissures/fissures.module';
import { InvasionsPageModule } from '../pages/invasions/invasions.module';
import { SortiesPageModule } from '../pages/sorties/sorties.module';
import { SyndicatesPageModule } from '../pages/syndicates/syndicates.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WarframeProvider } from '../providers/warframe/warframe';

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AlertsPageModule,
    EventsPageModule,
    FissuresPageModule,
    InvasionsPageModule,
    SortiesPageModule,
    SyndicatesPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WarframeProvider
  ]
})
export class AppModule {}
