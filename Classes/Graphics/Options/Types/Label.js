/*
    Label 'option' class
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class LabelOption extends Option{
    constructor(name, text){
        super(name, "label", text instanceof Object? text.text: text);
    }

    getText(){
        return this.getValue();
    }
    setText(text){
        return this.setValue(text);
    }

    //change Listeners
    onTextChange(func){
        return this.onChange(func);
    }
    offTextChange(func){
        return this.offChange(func);
    }
}
