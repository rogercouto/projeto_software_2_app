export class Token{

    constructor (
        public tokenType?:string,
        public expiresIn?:Number,
        public accessToken?:string,
        public refreshToken?:string
    ){}

}