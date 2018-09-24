import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, LoginPage, ReportsPage,
   MessagesPage, NotificationsPage, SettingsPage } from '../pages';

import { UserServiceProvider, LocationServiceProvider, EntityServiceProvider, CategoryServiceProvider, ReportServiceProvider } from '../providers';
import { User, Location, Entity, Category, Report } from '../model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public static readonly SERVER_URL = "http://cidadeunida.pipelinelab.com.br";
  //public static readonly SERVER_URL = "http://127.0.0.1:8000";

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon:string, component: any, notifications: number}>;

  //Atributos estáicos
  public static user : User = null;
  public static location : Location = null;
  public static entity: Entity = null;
  public static categories: Array<Category> = null;
  public static reports: Array<Report> = null;

  private static alertController : AlertController;
  public static loadingController : LoadingController;

  protected userName : string = "";

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private events : Events,
    private userService : UserServiceProvider,
    private locationService : LocationServiceProvider,
    private entityService : EntityServiceProvider,
    private categoryService: CategoryServiceProvider,
    private reportService: ReportServiceProvider,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController
  ) {
    //this.locationService.publishLocation();
    MyApp.alertController = alertCtrl;
    MyApp.loadingController = loadingCtrl;
    MyApp.user = this.userService.getLocalUser();
    if (MyApp.user != null)
      this.userName = MyApp.user.name;
    this.events.subscribe("user:login", (user) => {
      MyApp.user = user;
      this.userName = user.name;
      this.locationService.publishLocation();
    });
    this.categoryService.publishAll(); 
    this.events.subscribe('location:publish', (location) => {
      MyApp.location = location;
      this.entityService.publishEntity();
    });
    this.events.subscribe('entity:publish', (entity)=>{
      MyApp.entity = entity;
      if (entity != null)
        this.reportService.publishAll();
    });
    this.events.subscribe("categories:get",(categories)=>{
      MyApp.categories=categories;
    });
    this.events.subscribe("reports:get", (reports)=>{
      MyApp.reports = this.sortReports(reports);
    });
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', icon: 'home', component: HomePage, notifications: 0 },
      { title: 'Relatos', icon: 'albums', component: ReportsPage, notifications: 2 },
      { title: 'Mensagens', icon: 'text', component: MessagesPage, notifications: 3 }
    ];
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
    //document.getElementById('ue').textContent = 'JS Wins!';
    this.nav.setRoot(SettingsPage);
  }

  openNotifications(){
    this.nav.setRoot(NotificationsPage);
  }

  exit(){
    localStorage.removeItem('user');
    this.nav.setRoot(LoginPage);
  }

  static presentAlert(title: string, message : string) {
    let alert = MyApp.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  static getCategory(categoryId : number){
    for(let category of this.categories){
      if (category.id == categoryId)
        return category;
    }
    return null;
  }

  sortReports(reports : Array<Report>){
    if (reports == null)
      return;
    return reports.sort((report1, report2) => {
      if (report1.id < report2.id) {
          return 1;
      }
      if (report1.id > report2.id) {
          return -1;
      }
      return 0;
    });
  }

  static addReport(report: Report){
    const reports = new Array<Report>();
    reports.push(report);
    for(let r of this.reports){
      reports.push(r);
    }
    this.reports = reports;
  }

  haveEntity():boolean{
    return MyApp.entity != null;
  }

}
