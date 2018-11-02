import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntityServiceProvider } from '../../providers';
import { Entity, City, State, Location } from '../../model';
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

  protected allEntities : Array<Entity> = new Array<Entity>();
  protected filtredEntities : Array<Entity> = new Array<Entity>();
  protected redirectPage : any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public entityService: EntityServiceProvider) 
  {
    this.redirectPage = this.navParams.get('redirect');
    const loading = MyApp.loadingController.create({content:"Aguarde..."});
    loading.present();
    const resp = this.entityService.gerAll();
    resp.subscribe(
      apiEntities=>{
        for (let apiEntity of apiEntities){
          const entity = new Entity();
          entity.id = apiEntity.id;
          entity.name = apiEntity.name;
          entity.phone = apiEntity.phone;
          entity.email = apiEntity.email;
          entity.street = apiEntity.street;
          entity.number = apiEntity.number;
          entity.complement = apiEntity.complement;
          entity.city = new City();
          entity.city.id = apiEntity.city.id;
          entity.city.name = apiEntity.city.name;
          entity.city.state = new State();
          entity.city.state.id = apiEntity.city.state.id;
          entity.city.state.uf = apiEntity.city.state.uf;
          entity.city.state.name = apiEntity.city.state.name;
          this.allEntities.push(entity);
        }
        this.filtredEntities = this.allEntities;
        loading.dismiss();
      },
      error=>{
        loading.dismiss();
        MyApp.presentAlert("Erro!", error);
      }
    );
  }

  ionViewDidLoad() {
  }

  findLocal(ev){
    const text : string = ev.target.value;
    if (text.length > 0){
      this.filtredEntities = this.allEntities.filter((entity: Entity) => 
        entity.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.state.name.toUpperCase().includes(text.toUpperCase()) ||
        entity.city.state.uf.toUpperCase().includes(text.toUpperCase())
      );
    }else{
      this.filtredEntities = this.allEntities;
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
