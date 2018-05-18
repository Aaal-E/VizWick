/*
    The class for representing the areas where each visualisation is showed at
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*/
class VisualisationArea{
    constructor(areaName, areaElement, optionsCreationListener){
        this.areaName = areaName; //name of the area
        this.areaElement = areaElement; //an HTML element representing the location of the area
        //callback method to listen to new option objects cretaed:
        this.optionsCreationListener = optionsCreationListener;
    }

    setVisualisation(visualisationClass){
        this.deleteVisualisation();
        this.visualisationClass = visualisationClass;
        var tree = VisualisationHandler.getTree();
        if(tree){
            this.options = new Options();
            this.optionsCreationListener && this.optionsCreationListener(this.options);
            this.visualisation = new visualisationClass(this.areaElement, tree, this.options);
        }
        return this;
    }


    deleteVisualisation(){
        this.visualisation && this.visualisation.destroy();
    }


    refreshVisualisation(){
        this.visualisationClass && this.getVisualisation(this.visualisationClass);
        return this;
    }

    syncSelectedNodes(){}

    syncFocusedNodes(){}


}
