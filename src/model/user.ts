import { Token } from '../model';

export class User{
    
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public password?: string,
        public token?: Token,
        public firebaseToken?: string
    ){}

}