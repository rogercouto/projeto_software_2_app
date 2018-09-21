import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage, ReportPage, ReportsPage, ReportFormPage, ReportDetailsPage,
  MessageFormPage, MessagesPage, NotificationsPage, LoginPage, RegisterPage, SettingsPage } from '../pages/';
  import { UserServiceProvider, LocationServiceProvider, EntityServiceProvider, CategoryServiceProvider } from '../providers';
import { ReportServiceProvider } from '../providers/report-service/report-service';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ReportPage,
    ReportFormPage,
    ReportsPage,
    ReportDetailsPage,
    MessageFormPage,
    MessagesPage,
    NotificationsPage,
    RegisterPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ReportPage,
    ReportFormPage,
    ReportsPage,
    ReportDetailsPage,
    MessageFormPage,
    MessagesPage,
    NotificationsPage,
    RegisterPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    LocationServiceProvider,
    EntityServiceProvider,
    CategoryServiceProvider,
    Geolocation,
    NativeGeocoder,
    Camera,
    ReportServiceProvider,
    File
  ]
})
export class AppModule {}
