/*
    This links all the components together
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*/

window.VisualisationHandler =
new (class VisualisationHandler{
    constructor(){
        this.visAreaCollection = {}; //Holds instances of visualisationArea
        this.visClassCollection = {}; //Holds all available visualisations classes
        this.tree = null; //The tree object based on which the visualisation is cretaed.

        this.synchronisationData = { //Tracks the nodes in a certain state for syncrhnisation
            //default node states
            selected: null,
            highlighted: null,
            focused: null
        };
        this.selectedNodeListeners = []; //Functions that listen what noded is currently selected, in order to display their data
        this.treeListeners = []; //Functions that listen to a new tree being loaded
    }

    /**
     * VISUALISATION AREA REGISTRY
     */

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
        var names = Object.keys(this.visAreaCollection);
        for(var i=0; i<names.length; i++){
            var visAreaName = names[i];
            existingVisAreas.push(this.visAreaCollection[visAreaName]);
        };
        return existingVisAreas;
    }
    // returns an array of visualisation currently assigned to the visualisation areas (= shown on screen)
    getExistingVisualisations(){
        var existingVisualisations = [];
        var areas = this.getExistingVisAreas();
        for(var i=0; i<areas.length; i++){
            var visArea = areas[i];
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
        var clas = this.getVisualisationClass(visClassName);
        if(!area)
            console.log("Unknown area: "+areaName);
        else if(!clas)
            console.log("Unknown visualisation: "+visClassName);
        else
            area.setVisualisation(clas);
        return this;
    }

    /**
     * TREE MANAGEMENT
     */

    // returns the tree
    getTree(){
        return this.tree;
    }
    // set the tree, and also refreshes the visualisation areas accordingly
    setTree(tree){
        this.tree = tree;
        var areas = this.getExistingVisAreas();
        for(var i=0; i<areas.length; i++){
            var visArea = areas[i];
            visArea.refreshVisualisation();
        }
        for(var i=0; i<this.treeListeners.length; i++){
            this.treeListeners[i].call(this, tree);
        }
        return this;
    }
    // set the tree based on a data blob
    readBlob(blob){
        var reader = new FileReader();
        reader.readAsText(blob);
        var This = this;
        reader.onload=function(){
            var obj = makeTreeObj(reader.result);
            This.setTree(new Tree(obj));
        };
        return this;
    }

    addTreeListener(func){
        var index = this.treeListeners.indexOf(func);
        if(index==-1) this.treeListeners.push(func);
        return this;
    }
    removeTreeListener(func){
        var index = this.treeListeners.indexOf(func);
        if(index!=-1) this.treeListeners.splice(index, 1);
        return this;
    }

    /**
     * VISUALISATION REGISTRY
     */

    //lists a viusalisation class in the available viusalisations clolection
    registerVisualisation(aClass){
        this.visClassCollection[aClass.getDescription().name.toLowerCase()] = aClass;
        return this;
    }
    //given a visualisation class name, it returns the instance of that class
    getVisualisationClass(visClassName){
        return this.visClassCollection[visClassName.toLowerCase()];
    }
    //get a list of available visualisation classes
    getVisualisationTypes(){
        return Object.keys(this.visClassCollection);
    }


    /**
     * SYNCRHNISATION MANAGEMENT
     */

    synchronizeNode(type, node, sourceViz){
        this.synchronisationData[type] = node;
        var visualisations = this.getExistingVisualisations();
        for(var i=0; i<visualisations.length; i++){
            var vis = visualisations[i];
            if(vis!=sourceViz)  //don't forward to the visualisation that triggered the synchronisation
                vis.synchronizeNode(type, node, true);
        }

        //change the displayed data
        if(type=="highlighted" || (!this.synchronisationData.higlighted && type=="focused")){
            var dataNode = this.synchronisationData.highlighted || this.synchronisationData.focused;
            for(var i=0; i<this.selectedNodeListeners.length; i++){
                var listener = this.selectedNodeListeners[i];
                listener.call(this, dataNode);
            }
        }
        return this;
    }
    getSynchronisationData(){
        return this.synchronisationData;
    }

    addSelectedNodeListener(func){
        var index = this.selectedNodeListeners.indexOf(func);
        if(index==-1) this.selectedNodeListeners.push(func);
        return this;
    }
    removeSelectedNodeListener(func){
        var index = this.selectedNodeListeners.indexOf(func);
        if(index!=-1) this.selectedNodeListeners.splice(index, 1);
        return this;
    }
})();
