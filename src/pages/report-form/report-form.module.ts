import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportFormPage } from './report-form';

@NgModule({
  declarations: [
    ReportFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportFormPage),
  ],
})
export class ReportSendPageModule {}
