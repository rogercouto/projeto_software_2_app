import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ReportDetailsPage, ReportPage } from '../'
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  protected sel: string = "mines";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }

  openDetails(){
    this.navCtrl.push(ReportDetailsPage);
  }

  report(){
    this.navCtrl.push(ReportPage);
  }

  canReport(){
    return (MyApp.entity != null);
  }

}
