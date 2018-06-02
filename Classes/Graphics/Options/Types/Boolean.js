/*
    Boolean option class
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class BooleanOption extends Option{
    constructor(name, value){
        super(name, "boolean", value instanceof Object? value.value: value);
    }
}
