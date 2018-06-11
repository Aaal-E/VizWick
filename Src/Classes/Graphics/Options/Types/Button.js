/*
    Button 'option' class
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class ButtonOption extends Option{
    constructor(name){
        super(name, "button");
        this.clickListeners = [];
        this.iconListeners = [];
    }

    //icon
    getIcon(){
        return this.icon;
    }
    setIcon(iconName){
        this.icon = iconName;
        for(var i=0; i<this.iconListeners.length; i++)
            this.iconListeners[i].call(this, iconName);
        return this;
    }
    onIconChange(listener){
        var index = this.iconListeners.indexOf(listener);
        if(index==-1) this.iconListeners.push(listener);
        return this;
    }
    offIconChange(listener){
        var index = this.iconListeners.indexOf(listener);
        if(index!=-1) this.iconListeners.splice(index, 1);
        return this;
    }

    //text getter and setter
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

    //click listeners
    onClick(listener){
        var index = this.clickListeners.indexOf(listener);
        if(index==-1) this.clickListeners.push(listener);
        return this;
    }
    offClick(listener){
        var index = this.clickListeners.indexOf(listener);
        if(index!=-1) this.clickListeners.splice(index, 1);
        return this;
    }
    triggerClick(){
        for(var i=0; i<this.clickListeners.length; i++)
            this.clickListeners[i].call(this);
    }
}
