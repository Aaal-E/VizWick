/*
    Color utility class, contains methods for color manipulation
    Author: Tar van Krieken
    Starting Date: 07/06/2018
*/
class Color{
    constructor(red, green, blue, alpha){
        this.red = red||0;
        this.green = green||0;
        this.blue = blue||0;
        this.alpha = alpha||1;
    }
    static fromHSV(hue, saturation, value, alpha){
        return new Color(0,0,0).setHSV([hue, saturation, value]).setAlpha(alpha==undefined?1:alpha);
    }

    //getter/setters
    a(alpha){
        if(alpha!=undefined)return this.setAlpha(alpha);
        else                return this.getAlpha();
    }

    r(red){
        if(red!=undefined)  return this.setRed(red);
        else                return this.getRed();
    }
    g(green){
        if(green!=undefined)return this.setGreen(green);
        else                return this.getGreen();
    }
    b(blue){
        if(blue!=undefined) return this.setBlue(blue);
        else                return this.getBlue();
    }

    h(hue){
        if(hue!=undefined)  return this.setHue(hue);
        else                return this.getHue();
    }
    s(saturation){
        if(saturation!=undefined)return this.setSaturation(saturation);
        else                     return this.getSaturation();
    }
    v(value){
        if(value!=undefined)return this.setValue(value);
        else                return this.getValue();
    }

    //setters
    setAlpha(alpha){
        this.alpha = alpha;
        return this;
    }

    setRed(red){
        this.red = red;
        return this;
    }
    setGreen(green){
        this.green = green;
        return this;
    }
    setBlue(blue){
        this.blue = blue;
        return this;
    }
    setRGB(rgb){
        this.red = rgb[0];
        this.green = rgb[1];
        this.blue = rgb[2];
        return this;
    }

    setHue(hue){
        var hsv = this.getHSV();
        hsv[0] = hue;
        return this.setHSV(hsv);
    }
    setSaturation(saturation){
        var hsv = this.getHSV();
        hsv[1] = saturation;
        return this.setHSV(hsv);
    }
    setValue(value){
        var hsv = this.getHSV();
        hsv[2] = value;
        return this.setHSV(hsv);
    }
    setHSV(hsv){
        return this.setRGB(hsvToRgb(hsv));
    }

    //retrieve color methods
    getAlpha(){
        return this.alpha;
    }

    getRed(){
        return this.red;
    }
    getGreen(){
        return this.green;
    }
    getBlue(){
        return this.blue;
    }
    getRGB(){
        return [this.red, this.green, this.blue];
    }

    getHue(){
        return this.getHSV()[0];
    }
    getSaturation(){
        return this.getHSV()[1];
    }
    getValue(){
        return this.getHSV()[2];
    }
    getHSV(){
        return rgbToHsv([this.red, this.green, this.blue]);
    }

    getInt(){
        return (Math.round(255 - this.alpha * 255)<<24)
            +(Math.round(this.red)<<16)
            +(Math.round(this.green)<<8)
            +Math.round(this.blue);
    }
    getRGBInt(){
        return (Math.round(this.red)<<16)
            +(Math.round(this.green)<<8)
            +Math.round(this.blue);
    }

    //mixing methods
    mix(color, per){
        if(!(color instanceof Array)) color = color.getRGB();
        this.setRGB(mix(this.getRGB(), color, per));
        return this;
    }
    mixLinear(color, per){
        if(!(color instanceof Array)) color = color.getRGB();
        this.setRGB(mixLinear(this.getRGB(), color, per));
        return this;
    }
}

//common methods:
const hueColors = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]];
const rgbToHsv = function(rgb){
    var p = [[0, rgb[0]], [1, rgb[1]], [2, rgb[2]]];
    p.sort(function(a,b){
        return a[1]-b[1];
    });

    var l = hueColors.length;
    for(var i=0; i<l; i++){
        var c1 = hueColors[i];
        var c2 = hueColors[(i+1)%l];

        //check if rgb is between c1 and c2
        if(c1[p[0][0]] != c2[p[0][0]] || c1[p[0][0]]!=0) continue;
        if(c1[p[2][0]] != c2[p[2][0]] || c1[p[2][0]]!=255) continue;
        if(c1[p[1][0]] == c2[p[1][0]]) continue;

        //get hsv
        var saturation = 1-p[0][1]/p[2][1];
        if(isNaN(saturation)) saturation = 0;
        var value = p[2][1]/255;

        var dif = p[2][1]-p[0][1];
        var per = (p[1][1]-p[0][1])/dif;
        if(i%2==1) per = 1-per;
        var hue = per/l+i/l;
        if(isNaN(hue)) hue = 0;


        //return value
        var ret = [hue, saturation, value];
        return ret;
    }
}
const hsvToRgb = function(hsv){
    var l = hueColors.length;
    var index = Math.floor(hsv[0]*l);
    var per = hsv[0]*l%1;
    var c1 = hueColors[index%l];
    var c2 = hueColors[(index+1)%l];
    var color = mixLinear(c1, c2, per);
    color = mixLinear([255,255,255], color, hsv[1]);
    return mixLinear([0, 0, 0], color, hsv[2]);
};
const mix = function(color1, color2, per){
    var r = Math.sqrt(Math.pow(color2[0],2)*per+Math.pow(color1[0],2)*(1-per));
    var g = Math.sqrt(Math.pow(color2[1],2)*per+Math.pow(color1[1],2)*(1-per));
    var b = Math.sqrt(Math.pow(color2[2],2)*per+Math.pow(color1[2],2)*(1-per));
    var a = Math.sqrt(Math.pow(color2[3],2)*per+Math.pow(color1[3],2)*(1-per));
    if(isNaN(a)) a=255; //if a wasn't present in the color array
    return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)];
}
const mixLinear = function(color1, color2, per){
    var r = color2[0]*per+color1[0]*(1-per);
    var g = color2[1]*per+color1[1]*(1-per);
    var b = color2[2]*per+color1[2]*(1-per);
    var a = color2[3]*per+color1[3]*(1-per);
    if(isNaN(a)) a=255; //if a wasn't present in the color array
    return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)];
}
