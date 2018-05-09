/*
    Options class to indicate what options a visualisation has
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Options{
    constructor(){
        this.options = {};                  //All the values of the options
        this.optionsChangeListeners = [];   //Listeners to check whenever a option got created or removed
        this.optionListeners = {};           //Listeners to check whenever the value of an option has changed
    }
    
    //getters and setters
    setOption(option, value){
        var option = this.getOptionData(option);
        var oldValue = option.value;
        option.value = value;
        this.__updateOptionValue(option.name, oldValue);
    }
    getOptionData(option){
        return this.options[option];
    }
    getOption(option){
        return this.options[option].value;
    }
    
    //option creation/removal
    createOption(name, type, initValue){
        if(!this.options[name]){
            this.options[name] = {
                name: name,
                type: type,
                value: initValue
            };
            this.optionListeners[name] = [];
            this.__updateOptions("create", this.options[name]);
        }
        return this;
    }
    deleteOption(name){
        var option = this.options[name];
        if(option){
            delete this.options[name];
            this.__updateOptions("delete", option);
        }
        return this;
    }
    
    //event listener invokes
    __updateOptionValue(option, oldValue){
        var listeners = this.optionListeners[option];
        for(var i=0; i<listeners.length; i++){
            var l = listeners[i];
            l.call(this, this.options[option].value, oldValue);
        }
        return this;
    }
    __updateOptions(eventType, option){
        for(var i=0; i<this.optionsChangeListeners.length; i++){
            var l = this.optionsChangeListeners[i];
            l.call(this, eventType, option);
        }
        return this;
    }
    
    //register listeners
    onOptionsChange(listener){
        var index = this.optionsChangeListeners.indexOf(listener);
        if(index==-1) this.optionsChangeListeners.push(listener);
        return this;
    }
    offOptionsChange(listener){
        var index = this.optionsChangeListeners.indexOf(listener);
        if(index!=-1) this.optionsChangeListeners.splice(index, 1);
        return this;
    }
    onOptionChange(option, listener){
        var l = this.optionListeners[option];
        var index = l.indexOf(listener);
        if(index==-1) l.push(listener);
        return this;
    }
    offOptionChange(option, listener){
        var l = this.optionListeners[option];
        var index = l.indexOf(listener);
        if(index!=-1) l.splice(index, 1);
        return this;
    }
}
window.Options = Options;