import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ReportFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-form',
  templateUrl: 'report-form.html',
})
export class ReportFormPage {

  private _photo :string = "assets/imgs/image-regular.png";
  //private _photo :string = null;

  constructor(
    public navCtrl: NavController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportFormPage');
  }

  photo():string{
    return this._photo;
  }

  sendReport(){
    MyApp.presentAlert("Localização",JSON.stringify(MyApp.location));
  }

}
