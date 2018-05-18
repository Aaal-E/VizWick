/*
    This links all the components together
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*/
window.VisualisationHandler =
new (class VisualisationHandler{
    constructor (){
        this.visAreaCollection = {}; //holds instances of visualisationArea
        this.visClasses = {}; //Holds all available visualisations
        this.tree = null;
    }

    createVisArea(areaName, areaElement, optionsCreationListener){
        var visArea = new VisualisationArea(areaName, areaElement, optionsCreationListener);
        this.visAreaCollection[areaName] = visArea;
        return visArea;
    }

    getVisArea(areaName){
        return this.visAreaCollection[areaName];
    }

    getExistingVisAreas(){
        var existingVisAreas = [];
        for(var visAreaName in this.visAreaCollection){
            existingVisAreas.push(this.visAreaCollection[visAreaName]);
        };
        return existingVisAreas;
    }

    getExistingVisualisations(){
        var existingVisualisations = [];
        for(var visArea of this.getExistingVisAreas()){
           visArea.visualisation && existingVisualisations.push(visArea.visualisation);
        }
        return existingVisualisations;
    }

    //
    setVisualisationForArea(areaName, visClassName){
        var area = this.getVisArea(areaName);
        area.setVisualisation(this.getClass(visClassName));
    }

    //
    getClass(visClassName){
        return this.visClasses[visClassName];
    }

    //
    getTree(){
        return this.tree;
    }

    //
    setTree(tree){
        this.tree = tree;
        for(var visArea of this.getExistingVisAreas()){
            visArea.refreshVisualisation();
        }
        return this;
    }

    //
    registerClass(aClass){
        // this.visClasses[aClass.getName()] = aClass;
        this.visClasses[aClass.name] = aClass;
    }

})();
