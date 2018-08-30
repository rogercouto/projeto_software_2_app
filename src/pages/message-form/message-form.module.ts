import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageFormPage } from './message-form';

@NgModule({
  declarations: [
    MessageFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageFormPage),
  ],
})
export class MessageFormPageModule {}
