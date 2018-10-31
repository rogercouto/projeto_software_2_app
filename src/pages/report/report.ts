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

  protected allCategories : Array<Category>;
  protected categories : Array<Category> = new Array<Category>();

  constructor(public navCtrl: NavController) {
    if (MyApp.categories.length > 0){
      this.allCategories = MyApp.categories;
      this.categories = this.allCategories;
    }
  }

  ionViewDidLoad() {
  }

  selectCategory(category: Category) :void {
    this.navCtrl.push(ReportFormPage, {selectedCategory: category});
  }

  filterCategory(ev){
    const text : string = ev.target.value;
    if (text.length > 0){
      this.categories = this.allCategories.filter((category: Category) => 
        category.name.toUpperCase().includes(text.toUpperCase()) ||
        category.description.toUpperCase().includes(text.toUpperCase()) 
      );
    }else{
      this.categories = this.allCategories;
    }
  }
}

