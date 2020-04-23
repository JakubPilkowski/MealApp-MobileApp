

export default class PickerItem {

    constructor(label, value){
        this.label = label;
        this.value = value;
    }

    get getLabel(){
        return this.label;
    }

    get getValue(){
        return this.value;
    }

}