import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contact, Entity } from '../../model';
import { EntityServiceProvider } from '../../providers';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the MessageDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-details',
  templateUrl: 'message-details.html',
})
export class MessageDetailsPage {

  protected allEntities : Array<Entity> = new Array<Entity>();

  protected contact : Contact = new Contact();
  protected entity: Entity = new Entity();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private entityService: EntityServiceProvider) 
  {
    this.contact = this.navParams.get("contact");
    const loading = MyApp.loadingController.create({content:"Aguarde..."});
    loading.present();
    const resp = this.entityService.gerAll();
    resp.subscribe(
      apiEntities=>{
        this.allEntities = new Array<Entity>();
        for (let apiEntity of apiEntities){
           const entity = EntityServiceProvider.create(apiEntity);
           this.allEntities.push(entity);
        }
        loading.dismiss();
        for(let entity of this.allEntities){
          if (this.contact.entityId == entity.id){
            this.entity = entity;
            return;
          }
        }
      },
      error=>{
        loading.dismiss();
        MyApp.presentAlert("Erro!", error);
      }
    );
  }

  ionViewDidLoad() {
  }

}
