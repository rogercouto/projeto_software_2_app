import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntityServiceProvider } from '../../providers';
import { Entity, Location } from '../../model';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the LocalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-locals',
  templateUrl: 'locals.html',
})
export class LocalsPage {

  protected filtredEntities : Array<Entity> = new Array<Entity>();
  protected redirectPage : any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public entityService: EntityServiceProvider) 
  {
    this.redirectPage = this.navParams.get('redirect');
    this.filtredEntities = MyApp.entities;
  }

  ionViewDidLoad() {
  }

  findLocal(ev){
    const text : string = ev.target.value;
    if (text.length > 0){
      this.filtredEntities = MyApp.entities.filter((entity: Entity) => 
        entity.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.state.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.state.uf.toUpperCase().includes(text.toUpperCase())
      );
    }else{
      this.filtredEntities = MyApp.entities;
    }
  }

  selectEntity(entity: Entity){
    MyApp.entity = entity;
    if (MyApp.location == null)
      MyApp.location = new Location();
    MyApp.location.city = entity.city.name;
    MyApp.location.state = entity.city.state.name;
    MyApp.location.uf = entity.city.state.uf;
    MyApp.location.street = "";
    MyApp.location.number = "";
    MyApp.location.postalCode = "";
    this.navCtrl.setRoot(this.redirectPage);
  }

}
