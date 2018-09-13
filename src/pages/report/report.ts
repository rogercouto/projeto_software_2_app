import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ReportFormPage } from '../';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  selectCategory() :void {
    this.navCtrl.push(ReportFormPage);
  }

}

