(function(){'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/* Mehrdad Farsadyar  (1242624)*/function makeTreeObj(input){var stack=[];//holds the currently open nodes till processed
//var nodeObj = {name:null, parent:null, children:[]};
var rootOfRoot={name:null,parent:null,children:[]};var regex=',(); ';rootOfRoot.name='rootOfRoot';node=rootOfRoot;for(var i=input.length-1;i>=0;i--){var n=input.charAt(i);switch(n){case')':stack.push(node);node=subNode;break;case'(':// '(' => close up the open node
node=stack.pop();break;case',':// ',' => ignore
break;case';':// ';' => ignore
break;case' ':// ' ' => ignore
break;default:// assume all other characters are node names
subNode={name:null,parent:null,children:[]};subNode.name=n;var j=i-1;while(regex.indexOf(input[j])==-1&&j>=0){//can be simplified later using regexp
subNode.name=input[j]+subNode.name;j--}i=j+1;//offset by one, as i is decremented at end of the loop
subNode.parent=node;//set the parent to point to current open node
node.children.push(subNode);break;}}return rootOfRoot}/*
    The class for representing the areas at where each visualisation is shown
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*///a class to represent visualisation areas
var VisualisationArea=function(){function VisualisationArea(areaName,areaElement,optionsCreationListener){_classCallCheck(this,VisualisationArea);this.areaName=areaName;//name of the area
this.areaElement=areaElement;//an HTML element representing the location of the area
/*callback method to listen to new option objects cretaed: */this.optionsCreationListener=optionsCreationListener}// given a viusalisation class set an instance of it to this area
_createClass(VisualisationArea,[{key:'setVisualisation',value:function setVisualisation(visualisationClass){this.deleteVisualisation();//first remove any existing viusalisation from this area
this.visualisationClass=visualisationClass;var tree=VisualisationHandler.getTree();if(tree){//check if tree exists, otherwise do nothing
this.options=new Options;/* ??? */this.optionsCreationListener&&this.optionsCreationListener(this.options);/* create an instance of the viusalisaton class and assign it to the viusalisation field of this area */this.visualisation=new visualisationClass(this.areaElement,tree,this.options)}return this}// delete the viusalisation of this area if such visualisation exists
},{key:'deleteVisualisation',value:function deleteVisualisation(){this.visualisation&&this.visualisation.destroy()}//re-set the viusalisation to this area
},{key:'refreshVisualisation',value:function refreshVisualisation(){this.visualisationClass&&this.setVisualisation(this.visualisationClass);return this}//return the viusalisation assigmed to this area
},{key:'getVisualisation',value:function getVisualisation(){return this.visualisation}//
},{key:'syncSelectedNodes',value:function syncSelectedNodes(){}//
},{key:'syncFocusedNodes',value:function syncFocusedNodes(){}}]);return VisualisationArea}();/*
    This links all the components together
    Authors:
      Tar van Krieken
      Mehrdad Farsadyar
    Starting Date: 18/05/2018
*/window.VisualisationHandler=new(function(){function VisualisationHandler(){_classCallCheck(this,VisualisationHandler);this.visAreaCollection={};//Holds instances of visualisationArea
this.visClassCollection={};//Holds all available visualisations classes
this.tree=null;//The tree object based on which the visualisation is cretaed.
this.synchronisationData={//Tracks the nodes in a certain state for syncrhnisation
//default node states
select:null,highlight:null,focus:null}}/**
     * VISUALISATION AREA REGISTRY
     *///creates a viusalisation area and also saves it in the visAreaCollection
_createClass(VisualisationHandler,[{key:'createVisArea',value:function createVisArea(areaName,areaElement,optionsCreationListener){var visArea=new VisualisationArea(areaName,areaElement,optionsCreationListener);this.visAreaCollection[areaName]=visArea;return visArea}//Given an area name it returns the actual area object
},{key:'getVisArea',value:function getVisArea(areaName){return this.visAreaCollection[areaName]}// returns an array of existing visualisation areas
},{key:'getExistingVisAreas',value:function getExistingVisAreas(){var existingVisAreas=[];for(var visAreaName in this.visAreaCollection){existingVisAreas.push(this.visAreaCollection[visAreaName])};return existingVisAreas}// returns an array of visualisation currently assigned to the visualisation areas (= shown on screen)
},{key:'getExistingVisualisations',value:function getExistingVisualisations(){var existingVisualisations=[];var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=this.getExistingVisAreas()[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var visArea=_step.value;/*check if the visualisation area has a visualisation assigned to it
            and if so it gets that visualisation and pushes it in the array that
            is ultimately returnd */visArea.visualisation&&existingVisualisations.push(visArea.visualisation)}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}return existingVisualisations}// given a class name and an area name it sets the visualisation of that area
},{key:'setVisualisationForArea',value:function setVisualisationForArea(areaName,visClassName){var area=this.getVisArea(areaName);area.setVisualisation(this.getClass(visClassName));return this}/**
     * TREE MANAGEMENT
     */// returns the tree
},{key:'getTree',value:function getTree(){return this.tree}// set the tree, and also refreshes the visualisation areas accordingly
},{key:'setTree',value:function setTree(tree){this.tree=tree;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=this.getExistingVisAreas()[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var visArea=_step2.value;visArea.refreshVisualisation()}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}return this}// set the tree based on a data blob
},{key:'readBlob',value:function readBlob(blob){var reader=new FileReader;reader.readAsText(blob);var This=this;reader.onload=function(){var obj=makeTreeObj(reader.result);This.setTree(new Tree(obj))};return this}/**
     * VISUALISATION REGISTRY
     *///lists a viusalisation class in the available viusalisations clolection
},{key:'registerClass',value:function registerClass(aClass){this.visClassCollection[aClass.getDescription().name]=aClass;return this}//given a visualisation class name, it returns the instance of that class
},{key:'getClass',value:function getClass(visClassName){return this.visClassCollection[visClassName]}/**
     * SYNCRHNISATION MANAGEMENT
     */},{key:'synchronizeNode',value:function synchronizeNode(type,node,sourceViz){this.synchronisationData[type]=node;var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=this.getExistingVisualisations()[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var vis=_step3.value;if(vis!=sourceViz)//don't forward to the visualisation that triggered the synchronisation
vis.synchronizeNode(type,node,true)}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}}},{key:'getSynchronisationData',value:function getSynchronisationData(){return this.synchronisationData}}]);return VisualisationHandler}());})();