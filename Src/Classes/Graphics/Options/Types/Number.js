/*
    Number option class
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class NumberOption extends Option{
    constructor(name, step, min, max){
        super(name, "number");
        this.step = step||0.0001;
        this.min = min||-Infinity;
        this.max = max||Infinity;
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
