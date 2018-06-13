/*
    Options class to indicate what options a visualisation has
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Options{
    constructor(){
        this.options = {};                  //All the values of the options
        this.listeners = [];                //Listeners to check whenever an option got created or removed
    }

    destroy(){
        var keys = Object.keys(this.options);
        for(var i=0; i<keys.length; i++){
            var option = this.getOption(keys[i]);
            this.remove(option);
        }
        return this;
    }

    //getters and setters
    setValue(name, value){
        var option = this.getOption(name);
        if(option)
            option.setValue(value);
        return this;
    }
    getOption(name){
        return this.options[name];
    }
    getValue(name){
        return this.getOption(name).getValue();
    }

    //option creation/removal
    addOption(option){
        var name = option.getName();
        if(!this.options[name]){
            this.options[name] = option;
            this.__updateOptions("create", option);
        }
        return this;
    }
    add(option){
        return this.addOption(option);
    }
    removeOption(option){
        var name = option.getName();
        if(this.options[name] == option){
            delete this.options[name];
            this.__updateOptions("delete", option);
        }
        return this;
    }
    remove(option){
        return this.removeOption(option);
    }

    //event listener invokes
    __updateOptions(eventType, option){
        for(var i=0; i<this.listeners.length; i++){
            var l = this.listeners[i];
            l.call(this, eventType, option);
        }
        return this;
    }

    //register listeners
    onOptionsChange(listener){
        var index = this.listeners.indexOf(listener);
        if(index==-1){
            this.listeners.push(listener);

            //send data to webpage
            var keys = Object.keys(this.options);
            for(var i=0; i<keys.length; i++){
                var option = this.options[keys[i]];
                listener.call(this, "create", option);
            }
        }
        return this;
    }
    offOptionsChange(listener){
        var index = this.listeners.indexOf(listener);
        if(index!=-1) this.listeners.splice(index, 1);
        return this;
    }
}
window.Options = Options;

//set options
Options.Boolean = BooleanOption;
Options.Button = ButtonOption;
Options.Label = LabelOption;
Options.Number = NumberOption;
Options.State = StateOption;
Options.Text = TextOption;
