/*
    State option class (choose 1 of the given options)
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class StateOption extends Option{
    constructor(name, options){
        super(name, "state");
        this.options = options;
    }

    //get properties
    getOptions(){
        return this.options;
    }
}
