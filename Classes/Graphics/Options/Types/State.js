/*
    State option class (choose 1 of the given options)
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class StateOption extends Option{
    constructor(name, value){
        super(name, "state", null);
        if(value instanceof Object){
            this.options = value.options;
            this.value = value.value;
        }else
            throw Error("Object expected");
    }

    //get properties
    getOptions(){
        return this.options;
    }
}
