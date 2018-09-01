import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers';
import { User } from '../../model';
import { HomePage } from '../';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  protected user : User;

  protected name : string;
  protected nameError : boolean = false;

  protected togglePass : boolean = false;
  protected password : string = "";
  protected passError : boolean = false;
  protected confirmPass : string = "";
  protected confirmError : boolean = false;

  protected valid : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService : UserServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) 
  {
    this.user = this.userService.getLocalUser();
    this.name = this.user.name;
  }

  ionViewDidLoad() {
  }

  showAlert(message : string) {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  validate(){
    let test = true;
    if (this.name == "" || (!this.togglePass && this.name == this.user.name))
      test = false;
    if (this.togglePass){
      if (this.password == "" || this.confirmPass == "")
        test = false;
    } 
    this.valid = test;
  }

  changeName(){
    this.nameError = (this.name == "");
    this.validate();
  }

  changeToggle(){
    if (!this.togglePass){
      this.passError = false;
      this.confirmError = false;
    }
    this.validate();
  }

  changePass(){
    this.passError = (this.togglePass && this.password == "");
    this.validate();
  }

  changeConf(){
    this.validate();
  }

  save(){
    if (this.password != this.confirmPass){
      this.showAlert("Senha e confirmação devem ser iguais!")
      return;
    }
    const lc = this.loadingCtrl.create({content:'Aguarde...'});
    lc.present();
    const registerResponse = this.userService.register(this.user, this.confirmPass);
    registerResponse.subscribe(
      confirmation =>{
        const updatedUser = new User();
        updatedUser.id = this.user.id;
        updatedUser.name = this.name;
        updatedUser.email = this.user.email;
        updatedUser.token = this.user.token;
        this.userService.saveLocalUser(updatedUser);
        this.navCtrl.setRoot(HomePage);
      },
      err =>{
        lc.dismiss();
        console.log(err);
        this.showAlert("Sei lá cara");
      }
    );
  }

}
