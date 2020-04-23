const API_URL = "http://www.mocky.io/v2/5ea1ce4d310000f7611eee1d";
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
    static getUserOptions(){
        return fetch('http://www.mocky.io/v2/5e820a472f00000d002fb833');
    }

    static logIn(){

    }

    static register(){

    }

    static forgotPassword(){

    }
}