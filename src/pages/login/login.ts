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

  private readonly ERRORS = [
    {code: 0, message: "Não foi possível conetar com o servidor!"},
    {code: 400, message: "Usuário e(ou) senha não informado(s)!"},
    {code: 401, message: "Usuário e(ou) senha incorreto(s)!"}
  ];

  private errors: boolean = true;

  private email : string;
  private password : string;
  private user : User;

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
      apiToken => {
        const token = new Token();
        token.tokenType = apiToken.token_type;
        token.expiresIn = apiToken.expires_in;
        token.accessToken = apiToken.access_token;
        token.refreshToken = apiToken.refresh_token;
        const userResponse = this.userService.getUser(token);
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
        console.log(err.status);
        this.showAlert(this.getMessage(err.status));
      }
    );
  }

  getMessage(code : Number):string{
    let message = "Erro desconhecido!";
    this.ERRORS.forEach(function(error){
      if (error.code == code){
        message = error.message;
      }
    });
    return message;
  }

  showAlert(message : string) {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: message,
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
