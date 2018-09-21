import { MyApp } from "../app/app.component";

export class Report{

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
        public createdAt?:Date
    ){}
    
    get icon(){
        return MyApp.getCategory(this.categoryId).icon;
    }
}