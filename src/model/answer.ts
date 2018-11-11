import { User } from "./user";

export class Answer{

    constructor(
        public id?:number,
        public subject?:string,
        public content?:string,
        public userId?:number,
        public contactId?:number,
        public user?:User
    ){}

}