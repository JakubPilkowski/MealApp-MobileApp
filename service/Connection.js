import Axios from "axios";
const API_URL = "http://u2f38n4o.ddns.net:22222/";
const http = Axios.create({
    baseURL: API_URL,
});
export default class Connection {

    static async fetchWithTimeout(url, options = {}) {
        const result = Promise.race([
            http.get(url, options).then(res => res.data).catch((err) => {
                if (err.response) {
                    if (err.response.status >= 400 && err.response.status <= 599) {
                        throw new Error("Coś jest nie tak z serwerem");
                    }
                }
                else if (err.request) {
                    throw new Error("Brak internetu");
                }
                else {
                    throw new Error("Coś innego się stało");
                }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Za długi czas oczekiwania, sprawdź swoje połączenie internetowe')), 10000))
        ]).catch(err => err);
        return new Promise((resolve, reject) => {
            result.then(result => {
                if (result instanceof Error) {
                    reject(result.message);
                }
                else {
                    resolve(result);
                }
            })
        })
    }
    static getWojewodztwa() {
        return this.fetchWithTimeout(`voivodeships/slugs` + '?random_number=' + new Date().getTime());
    }
    static getMiastaForWojewodztwo(wojewodztwo) {
        return this.fetchWithTimeout(`voivodeships/${wojewodztwo}/places` + '?random_number=' + new Date().getTime());
    }
    static getJadlodajnie(wojewodztwo, miasto) {
        return this.fetchWithTimeout(`eatingHouses/voivodeship/${wojewodztwo}/place/${miasto}` + '?random_number=' + new Date().getTime());
    }
    static getEatingHousesNames() {
        return this.fetchWithTimeout(`eatingHousesNames` + '?random_number=' + new Date().getTime());
    }
    static getTags() {
        return this.fetchWithTimeout(`eatingHouseTags` + '?random_number=' + new Date().getTime());
    }
    static getSzczegolyJadlodajnia(slug, wojewodztwo, miasto) {
        return this.fetchWithTimeout(`eatingHouses/${slug}/voivodeship/${wojewodztwo}/place/${miasto}` + '?random_number=' + new Date().getTime());
    }
    static getUlubione() {
        return fetch('http://www.mocky.io/v2/5e749894300000d431a5f4d3' + '?random_number=' + new Date().getTime());
    }
    static getMapy(wojewodztwo, miasto) {
        return this.fetchWithTimeout(`map/eatingHouses/voivodeship/${wojewodztwo}/place/${miasto}` + '?random_number=' + new Date().getTime());
    }
    static getUserOptions() {
        return fetch('http://www.mocky.io/v2/5e820a472f00000d002fb833' + '?random_number=' + new Date().getTime());
    }
}