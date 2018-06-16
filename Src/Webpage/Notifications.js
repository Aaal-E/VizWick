/*
    Author: Tar van Krieken
    Date: 21-4-2018 (made for another website)
 */

//template system
var templates = {};
window.initTemplates = function(selectors, add, parent){
    window.initTemplatesSurfix("", selectors, add, parent);
}
window.initTemplatesSurfix = function(surfix, selectors, add, parent){
    if(!add) add="append";

    var selectorAr = selectors.split(",");
    var func = function(){
        for(var i=selectorAr.length-1; i>=0; i--){ //reverse loop through ar because elements will be removed
            var selector = selectorAr[i].replace(/\s*((\s|\w)*)\s*/g, "$1");
            var el = $(surfix+selector);
            if(el.length>0){
                selectorAr.splice(i, 1); //remove from array so there is no other attempt to init this
                el.removeClass("template");
                templates[selector] = {parent:parent||el.parent(), data:el[0].outerHTML, add:add};
                el.remove();
            }
        }
    };
    $(func);
    func();
}
window.loadTemplate = function(selector, parent, add){
    var template = templates[selector];
    var element = $(template.data);
    var add = add||template.add;
    if(typeof add != "string"){
        element.insertBefore(add);
    }else{
        (parent||template.parent)[add](element);
    }
    return element;
}

// alert system
var orAlert = alert;
var alertID = 0;
var transitionDuration = 400;
/*
    data fields:
    -type:              String
        notify, alert, hardAlert, verify
    -message            String
    -okButtonText       String
    -cancelButtonText   String
    -duration           Int (ms)
    -callback           Function
    -cancelCallback     Function
*/
window.alert = function(data){
    //setting defaults
    if(typeof(data)!="object") data = {message:data+""};
    if(!data.type) data.type="notify";
    if(!data.duration && data.type=="notify") data.duration=5000;
    if(!data.okButtonText)
        if(data.type!="verify") data.okButtonText="OK";
        else                    data.okButtonText="continue";
    if(!data.cancelButtonText) data.cancelButtonText="cancel";

    if(data.type=="hardAlert"){
        orAlert(data.message);
        if(data.callback) data.callback();
    }else{
        var ID = ++alertID;
        var element = loadTemplate(".alert");
        element.attr("ID", ID);

        //alert message
        element.find(".message").text(data.message);

        //alert type
        if(data.type=="notify") element.addClass("notify");
        if(data.type=="verify") element.addClass("verify");

        //buton text
        element.find(".okButton, .continueButton").text(data.okButtonText);
        element.find(".cancelButton").text(data.cancelButtonText);

        //ok event
        element.find(".okButton, .continueButton").click(function(){
            if(data.callback) data.callback();
            element[0].cancelCallback = null; //make it not fire again
            window.clearAlert(ID);
        });

        //cancel event
        element[0].cancelCallback = data.cancelCallback;
        element.find(".cancelButton").click(function(){
            if(data.cancelCallback) data.cancelCallback();
            element[0].cancelCallback = null; //make it not fire again
            window.clearAlert(ID);
        });

        //hide after certain delay if defined
        if(data.duration && data.duration<Infinity){
            setTimeout(function(){
                window.clearAlert(ID);
            }, data.duration);
        }
        if(data.duration==Infinity && data.type=="notify"){
            element.click(function(){
                window.clearAlert(ID);
            });
        }

        //make alert appear
        element.animate({height:element.find(".alertInner").outerHeight(true)}, {duration:transitionDuration});

        return ID;
    }
}
window.clearAlert = function(alertID){
    var element = $(".alert#"+alertID);
    if(element.length>0){
        element.animate({height:0}, {duration:transitionDuration, complete:function(){
            element.remove();
            if(element[0].cancelCallback){ //execute the cancel event
                element[0].cancelCallback();
            }
        }});
    }
}
$(function(){
    initTemplates(".alert");
});
