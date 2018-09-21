import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Report } from '../../model';

/**
 * Generated class for the ReportDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-details',
  templateUrl: 'report-details.html',
})
export class ReportDetailsPage {

  protected report : Report;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.report = navParams.get('report');
  }

  ionViewDidLoad() {
  }

}
