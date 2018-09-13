import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Location } from '../../model';
import { MyApp } from '../../app/app.component';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {

  constructor(public http: HttpClient, 
    private platform : Platform, 
    private geolocation : Geolocation, 
    private nativeGeocoder : NativeGeocoder,
    private events : Events) {
  }

  /**
   * Método que procura a localização do dispositivo e publica nos eventos
   * Outras classes que precisam dessa localização devem usar event.subscribe co o parametro location:get
   */
  publishLocation(){
    const lc = MyApp.loadingController.create({content:"Aguardando localização..."});
    lc.present();
    if (this.platform.is("cordova")){
      this.geolocation.getCurrentPosition().then((resp) => {
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderReverseResult[]) => {
          const location = new Location();
          if (result[0].locality != undefined)
            location.city = result[0].locality;
          else  
            location.city = result[0].subAdministrativeArea;
          location.state = result[0].administrativeArea;
          location.street = result[0].thoroughfare,
          location.number = result[0].subThoroughfare;
          location.postalCode = result[0].postalCode;
          this.events.publish('location:publish', location);
          lc.dismiss();
          const element = document.getElementById('inputcity');
          if (element != null)
            element.textContent = location.city+" - "+location.state;
        })
        .catch((error: any) => console.log(error));
      }).catch((error) => { 
        console.log(error);
        MyApp.presentAlert("Erro", JSON.stringify(error));
        lc.dismiss();
      });
    }else{
      const location = new Location();
      /*
      location.city = "Restinga Sêca";
      location.state = "Rio Grande do Sul";
      location.street = "Rua José Celestino Alves",
      location.number = "134";
      location.postalCode = "97200-000";
      */
      location.city = "Santa Maria";
      location.state = "Rio Grande do Sul";
      location.street = "Av. Roraima",
      location.number = "1000";
      location.postalCode = "97105-900";
      //console.log(location);
      this.events.publish('location:publish', location);
      lc.dismiss();
    }
  }

}
