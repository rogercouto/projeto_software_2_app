export class Reaction{

    constructor(
        public id?:number,
        public reaction?:boolean,
        public comment?:string,
        public reportId?:number,
        //Add name later
        public userId?:number
    ){}

}