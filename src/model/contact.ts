import { Answer } from "./";

export class Contact{

    public answers:Array<Answer>;

    constructor(
        public id?:number,
        public subject?:string,
        public content?:string,
        public userId?:number,
        public entityId?:number,
    ){
        this.answers = new Array<Answer>();
    }

}