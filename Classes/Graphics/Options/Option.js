/*
    Option class to create a specific option
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class Option{
    constructor(name, type, value){
        this.name = name;
        this.text = name;
        this.type = type;
        this.value = value;
        this.listeners = [];
    }
    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }
    getText(){
        return this.text;
    }
    setText(text){
        this.text = text;
        return this;
    }

    //setters and getters
    setValue(value){
        var oldValue = this.value;
        this.value = value;
        this.__triggerChange(oldValue);
        return this;
    }
    getValue(){
        return this.value;
    }

    //change listeners
    onChange(listener){
        var index = this.listeners.indexOf(listener);
        if(index==-1) this.listeners.push(listener);
        return this;
    }
    offChange(listener){
        var index = this.listeners.indexOf(listener);
        if(index!=-1) this.listeners.splice(index, 1);
        return this;
    }
    __triggerChange(oldValue){
        for(var i=0; i<this.listeners.length; i++)
            this.listeners[i].call(this, this.getValue(), oldValue);
    }
}
