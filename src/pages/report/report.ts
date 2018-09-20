import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ReportFormPage } from '../';
import { Category } from '../../model';
import { MyApp } from '../../app/app.component';

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

  protected categories : Array<Category>;

  constructor(public navCtrl: NavController) {
    if (MyApp.categories.length > 0)
      this.categories = MyApp.categories;
  }

  ionViewDidLoad() {
  }

  selectCategory(category: Category) :void {
    this.navCtrl.push(ReportFormPage, {selectedCategory: category});
  }

}

