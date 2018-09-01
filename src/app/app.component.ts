import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, LoginPage, ReportPage, ReportsPage,
   MessagesPage, NotificationsPage, SettingsPage } from '../pages';

import { UserServiceProvider } from '../providers';
import { User } from '../model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon:string, component: any, notifications: number}>;

  protected user : User;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private userService : UserServiceProvider) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', icon: 'home', component: HomePage, notifications: 0 },
      { title: 'Relatar problema', icon: 'send', component: ReportPage, notifications: 0 },
      { title: 'Relatos', icon: 'albums', component: ReportsPage, notifications: 2 },
      { title: 'Mensagens', icon: 'text', component: MessagesPage, notifications: 3 }
    ];
    this.user = this.userService.getLocalUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openSettings(){
    this.nav.setRoot(SettingsPage);
  }

  openNotifications(){
    this.nav.setRoot(NotificationsPage);
  }

  exit(){
    localStorage.removeItem('user');
    this.nav.setRoot(LoginPage);
  }
}
