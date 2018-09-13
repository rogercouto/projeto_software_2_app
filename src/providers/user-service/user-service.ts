import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { User, Token } from '../../model';
import { MyApp } from '../../app/app.component';
/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  
  public readonly CLIENT_SECRET = "vzcGTyWPN2csN7v0mHtqpgl8EK1O0tvH84B74D53";
  //public readonly CLIENT_SECRET = "WnNKftBPr31tkqatS1dtIeNWG44AVMUbkLhZRr28";

  public readonly TOKEN_URL = MyApp.SERVER_URL+"/oauth/token";

  public readonly USER_URL = MyApp.SERVER_URL+"/api/user";

  public readonly USERS_URL = MyApp.SERVER_URL+"/api/users";

  constructor(public http: Http) {
  }

  /**
   * Try connect to API using email and password
   * @param email api username
   * @param password api password
   * @returns JSON with token params
   */
  authenticate(email: string, password: string):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    const data = {
      grant_type: "password",
      client_id: Number(1),
      client_secret: this.CLIENT_SECRET,
      username: email,
      password: password
    }
    return this.http.post(this.TOKEN_URL, JSON.stringify(data), {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  /**
   * Return user from API
   * @param token - user token stored in LocalStorage
   */
  getUser(token : Token):Observable<User>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization',token.tokenType+' '+token.accessToken);
    return this.http.get(this.USER_URL, {headers:headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  /**
   * Save user in localStorage
   * @param user - User to save
   */
  saveLocalUser(user : User){
    localStorage['user'] = JSON.stringify(user);
    localStorage['lastEmail'] = user.email;
  }

  /**
   * Save last email used
   * @param email last email used
   */
  saveLastEmail(email : string){
    localStorage['lastEmail'] = email;
  }

  /**
   * Return logged user (with token)
   */
  getLocalUser(){
    const data = localStorage['user'];
    if (data){
      const localUser = JSON.parse(data);
      const user = new User();
      user.id = localUser.id;
      user.name = localUser.name;
      user.email = localUser.email;
      user.password = localUser.password;
      const localToken = localUser.token;
      const token = new Token();
      token.accessToken = localToken.accessToken;
      token.expiresIn = localToken.expiresIn;
      token.refreshToken = localToken.refreshToken;
      token.tokenType = localToken.tokenType;
      user.token = token;
      return user;
    }
    return null;
  }

  /**
   * Returns the last e-mail used and saved in localStorage
   */
  getLastEmail(){
    const data = localStorage['lastEmail'];
    if (data){
      return localStorage['lastEmail'];
    }
    return "";
  }

  /**
   * Register new user in api
   * @param user - user to be registred
   */
  register(user : User, confirmPass : string):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    const data = {
      name : user.name,
      password : user.password,
      password_confirmation : confirmPass,
      email : user.email
    }
    return this.http.post(this.USERS_URL, JSON.stringify(data), {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  /**
   * Update current user
   * @param user - user to be updated
   * @param confirmPass - (optional) if user.password and confirmPass matches, changes the current password
   */
  update(user: User, confirmPass?: string):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',user.token.tokenType+' '+user.token.accessToken);
    const data = (confirmPass == "") ? {
      name : user.name
    }:{
      name : user.name,
      password: user.password,
      password_confirmation: confirmPass
    }
    return this.http.put(this.USERS_URL, JSON.stringify(data), {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

}
