import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MessageFormPage } from '../';
import { ContactServiceProvider } from '../../providers';
import { Contact } from '../../model';
import { MyApp } from '../../app/app.component';
import { MessageDetailsPage } from '../message-details/message-details';
/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
 
  protected contacts : Array<Contact> = new Array<Contact>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contactService : ContactServiceProvider
  ){
    const resp = this.contactService.getAll();
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    resp.subscribe(
      apiContacts=>{
        this.contacts = new Array<Contact>();
        for(let apiContact of apiContacts){
          const contact = ContactServiceProvider.create(apiContact);
          if (MyApp.entity != null && contact.entityId == MyApp.entity.id){
            this.contacts.push(contact);
          }
        }
        loader.dismiss();
      },
      error=>{
        loader.dismiss();
        MyApp.presentAlert("Erro!", JSON.stringify(error));
      }
    );
  }

  ionViewDidLoad() {}

  openDetails(contact : Contact){
    this.navCtrl.push(MessageDetailsPage, {contact: contact});
  }

  openMessageForm(){
    this.navCtrl.push(MessageFormPage);
  }

}
