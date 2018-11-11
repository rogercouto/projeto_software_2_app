import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contact, Entity } from '../../model';
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

  protected contact : Contact = new Contact();
  protected entity: Entity = new Entity();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) 
  {
    this.contact = this.navParams.get("contact");
    this.entity = MyApp.getEntity(this.contact.entityId);
  }

  ionViewDidLoad() {
  }

}
