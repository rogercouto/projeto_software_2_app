import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ReportDetailsPage, ReportPage } from '../'
import { MyApp } from '../../app/app.component';
import { Report } from '../../model';
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
  protected mineReports = new Array<Report>();
  protected otherReports = new Array<Report>();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for (let report of MyApp.reports){
      if (MyApp.user.id == report.userId){
        this.mineReports.push(report);
      }else{
        this.otherReports.push(report);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }

  openDetails(report: Report){
    this.navCtrl.push(ReportDetailsPage, {report: report});
  }

  report(){
    this.navCtrl.push(ReportPage);
  }

  canReport(){
    return (MyApp.entity != null);
  }

}
