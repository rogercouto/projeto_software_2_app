export class Location{
  
    public constructor(
        public lat?:number,
        public lng?:number,
        public city?:string,
        public state?:string,
        public uf?:string,
        public street?:string,
        public number?:string,
        public postalCode?:string
    )
    {}


}