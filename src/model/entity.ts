import {City} from '../model';

export class Entity{

    constructor(
        public id?:number,
        public name?:string,
        public phone?:string,
        public email?:string,
        public street?:string,
        public number?:number,
        public complement?:string,
        public city?:City
    ){}


}