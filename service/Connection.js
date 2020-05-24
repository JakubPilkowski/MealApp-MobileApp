const API_URL = "http://u2f38n4o.ddns.net:22222/";

export default class Connection {
  
    static getWojewodztwa(){
        return fetch(`${API_URL}voivodeships/slugs`);
    }
    static getMiastaForWojewodztwo(wojewodztwo){
        return fetch(`${API_URL}voivodeships/${wojewodztwo}/places`);
    }

    static getJadlodajnie(){
        return fetch('http://www.mocky.io/v2/5ea1ce4d310000f7611eee1d');
    }
    static getSzczegolyJadlodajnia(){
        return fetch('http://www.mocky.io/v2/5e73641c300000d5512e64d0');
          
    }
    static getUlubione(){
        return fetch('http://www.mocky.io/v2/5e749894300000d431a5f4d3');
    }
    static getMapy(wojewodztwo, miasto){
        return fetch(`${API_URL}map/eatingHouses/voivodeship/${wojewodztwo}/place/${miasto}`);
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