/*
    The class for representing the areas at where each visualisation is shown
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
    Last update: 28/05/2018
*/

//a class to represent visualisation areas
class VisualisationArea{
    constructor(areaName, areaElement, optionsCreationListener){
        this.areaName = areaName; //name of the area
        this.areaElement = areaElement; //an HTML element representing the location of the area
        /*callback method to listen to new option objects cretaed: */
        this.optionsCreationListener = optionsCreationListener;
    }

    // given a viusalisation class set an instance of it to this area
    setVisualisation(visualisationClass){
        this.deleteVisualisation(); //first remove any existing viusalisation from this area
        this.visualisationClass = visualisationClass;
        var tree = VisualisationHandler.getTree();
        if(tree){ //check if tree exists, otherwise do nothing
            this.options = new Options();
            /* ??? */
            this.optionsCreationListener && this.optionsCreationListener(this.options);
            /* create an instance of the viusalisaton class and assign it to the viusalisation field of this area */
            this.visualisation = new visualisationClass(this.areaElement, tree, this.options);
        }
        return this;
    }

    // delete the viusalisation of this area if such visualisation exists
    deleteVisualisation(){
        this.visualisation && this.visualisation.destroy();
    }

    //re-set the viusalisation to this area
    refreshVisualisation(){
        this.visualisationClass && this.setVisualisation(this.visualisationClass);
        return this;
    }

    //return the viusalisation assigmed to this area
    getVisualisation(){
        return (this.visualisation);
    }

    //
    syncSelectedNodes(){}

    //
    syncFocusedNodes(){}


}
