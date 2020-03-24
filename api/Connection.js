

const API_URL = "http://www.mocky.io/v2/5e6fcae033000065f1f07c22";

export default class Connection {
  
    static getJadlodajnie(){
        return fetch(`${API_URL}`);
    }
    static getSzczegolyJadlodajnia(){
        return fetch('http://www.mocky.io/v2/5e73641c300000d5512e64d0');
    }
    static getUlubione(){
        return fetch('http://www.mocky.io/v2/5e749894300000d431a5f4d3');
    }
    static getMapy(){
        return fetch('http://www.mocky.io/v2/5e7a4d4730000078009309fa');
    }
    static logIn(){

    }

    static register(){

    }

    static forgotPassword(){

    }
}