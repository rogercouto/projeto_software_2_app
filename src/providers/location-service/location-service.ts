import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Location } from '../../model';
import { MyApp } from '../../app/app.component';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {

  constructor(public http: Http, 
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
    const lc = MyApp.loadingController.create({content:"Verificando localização..."});
    lc.present();
    if (this.platform.is("cordova")){
      this.geolocation.getCurrentPosition({timeout:15000}).then((resp) => {
        //MyApp.presentAlert("Cordenadas: ", "lat: "+resp.coords.latitude+", lng: "+resp.coords.longitude);
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderReverseResult[]) => {
          //MyApp.presentAlert("Localização: ", JSON.stringify(result[0]));
          const location = new Location();
          location.lat = resp.coords.latitude;
          location.lng = resp.coords.longitude;
          if (result[0].locality != undefined)
            location.city = result[0].locality;
          else  
            location.city = result[0].subAdministrativeArea;
          location.state = result[0].administrativeArea;
          location.street = result[0].thoroughfare,
          location.number = result[0].subThoroughfare;
          //location.postalCode = result[0].postalCode; //incorrect
          //Get the correct postal code:
          const r = this.http.get(this.getApiUrl(resp.coords.latitude, resp.coords.longitude))
            .map(response => response.json())
            .catch(error => Observable.throw(error));
          r.subscribe(
            data => {
              location.postalCode = data.Response.View[0].Result[0].Location.Address.PostalCode;
              location.uf = data.Response.View[0].Result[0].Location.Address.State;
              this.events.publish('location:publish', location);
              lc.dismiss();
              const element = document.getElementById('inputcity');
              if (element != null)
                element.textContent = location.city+" - "+location.uf;
            },
            err => {
              lc.dismiss();
              MyApp.presentAlert("Erro", JSON.stringify(err));
            }
          );
        })
        .catch((error: any) => console.log(error));
      }).catch((error) => { 
        //MyApp.presentAlert("Erro", JSON.stringify(error));
        lc.dismiss();
        MyApp.presentAlert("Aviso", "Não foi possível recuperar a localização atual!");
        this.events.publish('location:publish', null);
      });
    }else{
      const location = new Location();
      location.lat = 0;
      location.lng = 0;
      /*
      location.city = "Restinga Seca";
      location.state = "Rio Grande do Sul";
      location.uf = "RS";
      location.street = "Rua José Celestino Alves",
      location.number = "134";
      location.postalCode = "97200-000";
      */
      location.city = "Santa Maria";
      location.state = "Rio Grande do Sul";
      location.uf = "RS";
      location.street = "Av. Roraima",
      location.number = "1000";
      location.postalCode = "97105-900";
      lc.dismiss();
      this.events.publish('location:publish', location);
      /*
      //console.log(location);
      MyApp.presentAlert("Aviso", "Não foi possível recuperar a localização atual!");
      lc.dismiss();
      this.events.publish('location:publish', null); 
     */
    }
  }

  getApiUrl(latitude : number, longitude : number){
    let url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=";
    url += latitude;
    url += "%2C";
    url += longitude;
    url += "&mode=retrieveAddresses&maxresults=1&gen=9&app_id=93fVH604P43wYaps3yk6&app_code=wAQY_jq5EmkHqgubrXwcmw";
    return url;
  }

  publishLocationX(showLoading = false){
    const lc = MyApp.loadingController.create({content:"Verificando localização..."});
    if (showLoading)
      lc.present();
    if (this.platform.is("cordova")){
      this.geolocation.getCurrentPosition().then((resp) => {
        let url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=";
        url += resp.coords.latitude;
        url += "%2C";
        url += resp.coords.longitude;
        url += "&mode=retrieveAddresses&maxresults=1&gen=9&app_id=93fVH604P43wYaps3yk6&app_code=wAQY_jq5EmkHqgubrXwcmw";
        const r = this.http.get(url).map(response => response.json()).catch(error => Observable.throw(error));
        r.subscribe(
          data => {
            //-29.8138258,-53.3755404
            const location = new Location();
            location.city = data.Response.View.Result.Location.Adress.City;
            location.state = data.Response.View.Result.Location.Adress.State;
            location.street = "Av. Roraima",
            location.number = "1000";
            location.postalCode = "97105-900";
            if (showLoading)
              lc.dismiss();
          },
          err => {
            if (showLoading)
              lc.dismiss();
            MyApp.presentAlert("Erro", JSON.stringify(err));
          }
        );
      }).catch((error) => { 
        MyApp.presentAlert("Erro", JSON.stringify(error));
        lc.dismiss();
      });
    }else{

    }  
      
  }

}
