import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { Firebase } from '@ionic-native/firebase';
import { FCM } from '@ionic-native/fcm';

import { HomePage, LoginPage, ReportsPage,
   MessagesPage, NotificationsPage, SettingsPage } from '../pages';

import { UserServiceProvider, LocationServiceProvider, EntityServiceProvider, CategoryServiceProvider, ReportServiceProvider, NotificationServiceProvider } from '../providers';
import { User, Location, Entity, Category } from '../model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public static readonly SERVER_URL = "http://cidadeunida.pipelinelab.com.br";
  //public static readonly SERVER_URL = "http://127.0.0.1:8000";

  rootPage: any = LoginPage;

  pages: Array<{index: number, title: string, icon:string, component: any, notificationId: string, notifications: number}>;

  //Atributos estáticos
  public static user : User = null;
  public static location : Location = null;
  public static cannotLocate = false;
  public static entities : Array<Entity> = new Array<Entity>();
  public static entity: Entity = null;
  public static categories: Array<Category> = null;
  
  private static alertController : AlertController;
  public static loadingController : LoadingController;

  protected userName : string = "";
  protected notifications : number = 0;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public push: Push,
    //public firebase: Firebase,
    public fcm: FCM,
    private events : Events,
    private userService : UserServiceProvider,
    private locationService : LocationServiceProvider,
    private entityService : EntityServiceProvider,
    private categoryService: CategoryServiceProvider,
    private reportService: ReportServiceProvider,
    private notificationService: NotificationServiceProvider,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController
  ) {
    //this.locationService.publishLocation();
    MyApp.alertController = alertCtrl;
    MyApp.loadingController = loadingCtrl;
    MyApp.user = this.userService.getLocalUser();
    if (MyApp.user != null)
      this.userName = MyApp.user.name;
    this.events.subscribe('location:publish', (location) => {
      //console.log(location);
      if (location != null){
        MyApp.location = location;
        this.entityService.publishEntity();
      }
    });
    this.events.subscribe("user:login", (user) => {
      MyApp.user = user;
      this.userName = user.name;
      if (platform.is("cordova")){
        this.fcm.getToken().then(
          token =>{
            if (MyApp.user != null){
              MyApp.user.firebaseToken = token;
              const resp = this.userService.updateFirebaseToken(MyApp.user);
              resp.subscribe(
                conf=>{
                },
                error=>{
                  MyApp.presentAlert("Teste", JSON.stringify(error));
                }
              );
            }
          }
        );
      }
      const notResp = this.notificationService.getUnreadedCount();
      notResp.subscribe(
        count=>{
          this.notifications = count;
          MyApp.user.notifications = count;
        },
        error=>{
          MyApp.presentAlert("Erro", error)
        }
      );
      this.locationService.publishLocation();
      //
      if (MyApp.user != null){
        this.entityService.publishAll();
        this.events.subscribe("entities:publish", (entities)=>{
          MyApp.entities = entities;
        });
        this.categoryService.publishAll(); 
      }
      this.events.subscribe('entity:publish', (entity)=>{
        if (entity != null){
          MyApp.entity = entity;
          this.reportService.publishAll();
        }
      });
      this.events.subscribe("categories:get",(categories)=>{
        MyApp.categories=categories;
      });
      this.events.subscribe("notification:view",(notification)=>{
        const resp = this.notificationService.setReaded(notification);
        const loader = MyApp.loadingController.create();
        loader.present();
        resp.subscribe(
          ret=>{
            loader.dismiss();
            const notResp = this.notificationService.getUnreadedCount();
            notResp.subscribe(
              count=>{
                this.notifications = count;
              },
              error=>{
                MyApp.presentAlert("Erro", error)
              }
            );
            if (notification.reportId == null && notification.messageId == null)
              this.nav.setRoot(NotificationsPage);
          },
          error=>{
            MyApp.presentAlert("Erro", error);
            loader.dismiss();
          }
        );
      })
    });
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { index: 0, title: 'Início', icon: 'home', component: HomePage, notificationId: '', notifications: 0 },
      { index: 1, title: 'Relatos', icon: 'albums', component: ReportsPage, notificationId: 'not-rel', notifications: 0 },
      { index: 2, title: 'Mensagens', icon: 'text', component: MessagesPage, notificationId: 'not-msg', notifications: 0 }
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pushsetup();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  pushsetup() {
    const options: PushOptions = {};
    const pushObject: PushObject = this.push.init(options);
    pushObject.on("registration").subscribe((registration: any) => {
      MyApp.presentAlert("Teste", JSON.stringify(registration));
    });
    pushObject.on("notification").subscribe((notification: any) => {
      MyApp.presentAlert("Teste", JSON.stringify(notification));
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  /*
  openPage(pageIndex : number){
    this.nav.setRoot(this.pages[pageIndex].component);
  }
  */


  openSettings(){
    //document.getElementById('ue').textContent = 'JS Wins!';
    this.nav.setRoot(SettingsPage);
  }

  openNotifications(){
    this.nav.setRoot(NotificationsPage);
  }

  exit(){
    /*
    const loading = MyApp.loadingController.create({content:"Saindo..."});
    loading.present();
    MyApp.user.firebaseToken = null;
    const resp = this.userService.updateFirebaseToken(MyApp.user);
    resp.subscribe(conf=>{
        if (conf){
          localStorage.removeItem('user');
          this.nav.setRoot(LoginPage);
          loading.dismiss();
        }
      },error=>{
        loading.dismiss();
        MyApp.presentAlert("Erro", error)
      }
    );
    */
    this.platform.exitApp();
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

  static getEntity(entityId : number){
    for (let entity of this.entities){
      if (entity.id == entityId)
        return entity;
    }
    return null;
  }

  haveEntity():boolean{
    return MyApp.entity != null;
  }

}
