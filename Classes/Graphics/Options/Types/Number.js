/*
    Number option class
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class NumberOption extends Option{
    constructor(name, value){
        super(name, "number", null);
        var min = 1;
        var step = 1;
        var max = 10;
        if(value instanceof Object){
            if(value.min) min = value.min;
            if(value.step) step = value.step;
            if(value.max) max = value.max;
            value = value.value;
        }

        this.value = value;
        this.min = min;
        this.step = step;
        this.max = max;
    }

    //get properties
    getMin(){
        return this.min;
    }
    getStep(){
        return this.step;
    }
    getMax(){
        return this.max;
    }

    //make sure value considers constraints
    setValue(value){
        value = Math.max(this.min, Math.min(this.max, Math.floor(value/this.step)*this.step));
        return super.setValue(value);
    }
}
