import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { RegisterPage } from '../';
import { UserServiceProvider } from '../../providers';
import { User, Token } from '../../model';

import { HomePage } from '../';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private errors: boolean = false;

  private email : string;
  private password : string;
  private user : User;
  private token: Token;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService : UserServiceProvider,
    private loadingCtrl : LoadingController,
    private alertCtrl: AlertController) 
  {
    if (this.userService.getLocalUser() != null){
      this.navCtrl.setRoot(HomePage);
    }
    this.email = this.userService.getLastEmail();
    this.password = "";
  }

  ionViewDidLoad() {
  }

  doLogin(){
    const lc = this.loadingCtrl.create({content:'Aguarde...'});
    lc.present();
    const authResponse = this.userService.authenticate(this.email, this.password);
    authResponse.subscribe(
      token => {
        this.token = token;
        const userResponse = this.userService.getUser(this.token);
        userResponse.subscribe(
          apiUser => {
            this.user = new User();
            this.user.id = apiUser.id;
            this.user.name = apiUser.name;
            this.user.email = apiUser.email,
            this.user.password = this.password,
            this.user.token = token;
            this.userService.saveLocalUser(this.user);
            lc.dismiss();
            this.navCtrl.setRoot(HomePage);
          }
        );
      },
      err => {
        lc.dismiss();
        this.showAlert();
      }
    );
  }

  verifyToken(user : User){
    const userResponse = this.userService.getUser(this.token);
    userResponse.subscribe(
      apiUser => {
        return true;
      },
      err =>{
        return false;
      }
    );
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: 'Usuário ou senha(s) incorreto(s)',
      buttons: ['Ok']
    });
    alert.present();
  }

  checkForm(){
    this.errors = (this.email == "" || this.password == "");
  }

  haveErrors(){
    return this.errors;
  }

  openRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

}
