

const API_URL = "http://www.mocky.io/v2/5e6fcae033000065f1f07c22";

export default class Connection {
  
    static getJadlodajnie(service){
        return fetch(`${API_URL}`);
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