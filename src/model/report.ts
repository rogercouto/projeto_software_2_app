import { MyApp } from "../app/app.component";
import { Reaction } from "./reaction";

export class Report{

    public reactions : Array<Reaction> = new Array<Reaction>();

    constructor(
        public id?:number,
        public description?:string,
        public address?:string,
        public userId?:number,
        public entityId?:number,
        public categoryId?:number,
        public lat?:number,
        public lng?:number,
        public photo?:any,
        public createdAt?:Date,
        public status?:number,
        public positiveReactions?:number,
        public negativeReactions?:number
    ){}
    
    get icon(){
        return MyApp.getCategory(this.categoryId).icon;
    }

    get situation(){
        switch(this.status){
            case 1:return "Aberto";
            case 2:return "Em andamento";
            case 3:return "Concluído";
        }
        return "???";
    }

    removeReaction(reaction : Reaction){
        this.reactions = this.reactions.filter(r => r.id !== reaction.id);
    }
}