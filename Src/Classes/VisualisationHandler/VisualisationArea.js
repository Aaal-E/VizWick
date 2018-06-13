/*
    The class for representing the areas at where each visualisation is shown
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*/

//a class to represent visualisation areas
class VisualisationArea{
    constructor(areaName, areaElement, optionsCreationListener){
        this.areaName = areaName; //name of the area
        this.areaElement = areaElement; //an HTML element representing the location of the area
        /*callback method to listen to new option objects cretaed: */
        this.optionsCreationListener = optionsCreationListener;

        this.wasInVR = false; //whether this visualisation was shown in VR before it was destroyed
    }

    // given a viusalisation class set an instance of it to this area
    setVisualisation(visualisationClass){
        this.deleteVisualisation(); //first remove any existing viusalisation from this area
        this.visualisationClass = visualisationClass;
        var tree = VisualisationHandler.getTree();
        if(tree){ //check if tree exists, otherwise do nothing
            this.options = new Options();
            /* create an instance of the viusalisaton class and assign it to the viusalisation field of this area */
            this.visualisation = new visualisationClass(this.areaElement, tree, this.options);

            /* send the options to the page so they can be added to the page */
            this.optionsCreationListener && this.optionsCreationListener(this.options, this.visualisation);

            //handle VR content
            if(this.wasInVR){
                this.wasInVR = false;
                //show this visualisation in VR if 3d
                if(this.visualisation instanceof VIZ3D.Visualisation){
                    VRCamera.setVisualisation(this.visualisation);
                }else{
                    //else find a random available 3d visualisation to show
                    for(var vis of VisualisationHandler.getExistingVisualisations()){
                        if(vis instanceof VIZ3D.Visualisation){
                            VRCamera.setVisualisation(vis);
                            break;
                        }
                    }
                }
            }

            console.info("Visualisation '"+visualisationClass.description.name+"' created");
        }
        return this;
    }

    // delete the viusalisation of this area if such visualisation exists
    deleteVisualisation(){
        if(this.visualisation){
            this.wasInVR = this.visualisation.isInVR && this.visualisation.isInVR();
            this.visualisation.destroy();
            this.visualisation = null;
        }
        return this;
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

    //VR methods
    isInVR(){
        if(this.visualisation)
            return this.visualisation.isInVR();
        return false;
    }

    //TODO
    syncSelectedNodes(){}

    //TODO
    syncFocusedNodes(){}
}
