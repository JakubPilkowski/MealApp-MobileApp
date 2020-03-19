

const API_URL = "http://www.mocky.io/v2/5e6fcae033000065f1f07c22";

export default class Connection {
  
    static getJadlodajnie(){
        return fetch(`${API_URL}`);
    }
    static getSzczegolyJadlodajnia(){
        return fetch('http://www.mocky.io/v2/5e73641c300000d5512e64d0');
    }
    static getUlubione(){
        return fetch(`${API_URL}`);
    }

    static logIn(){

    }

    static register(){

    }

    static forgotPassword(){

    }
}