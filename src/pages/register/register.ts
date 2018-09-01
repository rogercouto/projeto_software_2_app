import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { User } from '../../model/index';
import { UserServiceProvider } from '../../providers/index';
import { LoginPage } from '../index';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private readonly ERRORS = [
    {code: 0, message: "Não foi possível conetar com o servidor!"},
    {code: 400, message: "Esse e-mail já está em uso!"}
  ];

  private user : User;
  private confirmPass: string;

  protected errors : boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl : LoadingController,
    private alertCtrl: AlertController,
    private userService : UserServiceProvider
  ) 
  {
    this.user = new User();
    this.user.name = "";
    this.user.password = "";
    this.user.email = "";
    this.confirmPass = "";
  }

  ionViewDidLoad() {
  }

  checkForm(){
    this.errors = this.user.name == "" || this.user.email == "" || this.user.password == "" || this.confirmPass == "";
  }

  doRegister(){
    if (this.user.password != this.confirmPass){
      this.showAlert("Senha e confirmação devem ser iguais!");
      return;
    }
    const lc = this.loadingCtrl.create({content:'Aguarde...'});
    lc.present();
    const registerResponse = this.userService.register(this.user, this.confirmPass);
    registerResponse.subscribe(
      apiUserCreated =>{
        this.userService.saveLastEmail(apiUserCreated.email);
        lc.dismiss();
        this.navCtrl.setRoot(LoginPage);
      },
      err =>{
        lc.dismiss();
        this.showAlert(this.getMessage(err.status));
      }
    );
  }

  getMessage(code : Number):string{
    let message = "Erro desconhecido!";
    this.ERRORS.forEach(function(error){
      console.log(error.code+" == "+code);
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

}
