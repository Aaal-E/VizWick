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
        this.visClassCollection = {}; //Holds all available visualisations classes
        this.tree = null; //The tree object based on which the visualisation is cretaed.
    }

    //creates a viusalisation area and also saves it in the visAreaCollection
    createVisArea(areaName, areaElement, optionsCreationListener){
        var visArea = new VisualisationArea(areaName, areaElement, optionsCreationListener);
        this.visAreaCollection[areaName] = visArea;
        return visArea;
    }

    //Given an area name it returns the actual area object
    getVisArea(areaName){
        return this.visAreaCollection[areaName];
    }

    // returns an array of existing visualisation areas
    getExistingVisAreas(){
        var existingVisAreas = [];
        for(var visAreaName in this.visAreaCollection){
            existingVisAreas.push(this.visAreaCollection[visAreaName]);
        };
        return existingVisAreas;
    }

    // returns an array of visualisation currently assigned to the visualisation areas (= shown on screen)
    getExistingVisualisations(){
        var existingVisualisations = [];
        for(var visArea of this.getExistingVisAreas()){
            /*check if the visualisation area has a visualisation assigned to it
            and if so it gets that visualisation and pushes it in the array that
            is ultimately returnd */
           visArea.visualisation && existingVisualisations.push(visArea.visualisation);
        }
        return existingVisualisations;
    }

    // given a class name and an area name it sets the visualisation of that area
    setVisualisationForArea(areaName, visClassName){
        var area = this.getVisArea(areaName);
        area.setVisualisation(this.getClass(visClassName));
    }

    //given a visualisation class name, it returns the instance of that class
    getClass(visClassName){
        return this.visClassCollection[visClassName];
    }

    // returns the tree
    getTree(){
        return this.tree;
    }

    // set the tree, and also refreshes the visualisation areas accordingly
    setTree(tree){
        this.tree = tree;
        for(var visArea of this.getExistingVisAreas()){
            visArea.refreshVisualisation();
        }
        return this;
    }

    //lists a viusalisation class in the available viusalisations clolection
    registerClass(aClass){
        // this.visClasses[aClass.getName()] = aClass;
        this.visClassCollection[aClass.name] = aClass;
    }

})();
