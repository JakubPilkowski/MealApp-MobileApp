export default class Validation {


    static emailVerification(text) {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return !reg.test(text.trim()) ?
            "Niepoprawny email \n" :
            "";
    }
    static passwordVerification(text) {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/;
        return !reg.test(text.trim()) ?
            "Hasło musi zawierać co najmniej 8 znaków, małą i dużą literę oraz cyfrę \n" :
            "";
    }

    static loginVerification(text) {
        const reg = /^.{4,20}$/
        return !reg.test(text.trim()) ?
            "Login musi zawierać co najmniej 4 znaki\n" :
            "";
    }
    static wojewodztwoVerification(text) {
        return text === "default" || text.length === 0 ?
            "Województwo nie może być puste lub być wartością domyślną \n" :
            "";
    }

    static miastoVerification(text) {
        return text === "default" || text.length === 0 ?
            "Miasto nie może być puste lub być wartością domyślną \n" :
            "";
    }

}