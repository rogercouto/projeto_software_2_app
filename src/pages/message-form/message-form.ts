import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../providers';
import { Entity, Contact } from '../../model';
import { MyApp } from '../../app/app.component';
import { MessagesPage } from '../messages/messages';

/**
 * Generated class for the MessageFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-form',
  templateUrl: 'message-form.html',
})
export class MessageFormPage {

  protected entity : Entity;
  protected contact: Contact = new Contact();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contactService: ContactServiceProvider
  ) {
    this.entity = MyApp.entity;
  }

  ionViewDidLoad() {
  }

  send(){
    this.contact.entityId = this.entity.id;
    this.contact.userId = MyApp.user.id;
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    const resp = this.contactService.send(this.contact);
    resp.subscribe(
      conf=>{
        loader.dismiss();
        if (conf){
          MyApp.presentAlert("Mensagem enviada!", "Em breve a entidade deverá responde-la");
          this.navCtrl.setRoot(MessagesPage);
        }
      },
      error=>{
        loader.dismiss();
        MyApp.presentAlert("Erro!", JSON.stringify(error));
      }
    );
  }

}
