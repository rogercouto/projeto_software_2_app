import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

import { HomePage, LoginPage, ReportPage, ReportsPage,
   MessagesPage, NotificationsPage, SettingsPage } from '../pages';

import { UserServiceProvider } from '../providers';
import { User, Location } from '../model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon:string, component: any, notifications: number}>;

  protected user : User;

  public static location : Location = new Location();

  private static alertController : AlertController;
  private static geolocation : Geolocation;
  private static nativeGeocoder : NativeGeocoder;
  public static loadingController : LoadingController;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private userService : UserServiceProvider,
    alertCtrl: AlertController,
    geoloc: Geolocation,
    natGeocoder: NativeGeocoder,
    loadingCtrl: LoadingController
  ) {
    MyApp.alertController = alertCtrl;
    MyApp.geolocation = geoloc;
    MyApp.nativeGeocoder = natGeocoder;
    MyApp.loadingController = loadingCtrl;
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

  public static async getLocation(showLoading: boolean = false){
    const lc = this.loadingController.create({content: "Aguarde"});
    if (showLoading)
      lc.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.location.city = result[0].locality;
        this.location.state = result[0].administrativeArea;
        this.location.street = result[0].thoroughfare,
        this.location.number = result[0].subThoroughfare;
        this.location.postalCode = result[0].postalCode;
        if (showLoading)
          lc.dismiss();
      })
      .catch((error: any) => console.log(error));
    }).catch((error) => { 
      if (showLoading)
        lc.dismiss();
    });
  }

  ngOnInit(){
    MyApp.getLocation();
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

  isUserLogged(){
    if (this.user == null){
      this.user = this.userService.getLocalUser();
    }
    return (this.user != null);
  }

  static presentAlert(title: string, message : string) {
    let alert = MyApp.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

}
