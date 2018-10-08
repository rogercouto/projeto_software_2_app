export class Update{
    constructor(
        public id?:number,
        public description?:string,
        public userId?:number,
        public reportId?:number,
        public createdAt?:Date
    ){}
}