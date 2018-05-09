(function(){"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}/*
	Alex Thieme
	30-04-2018
	
*//*
	main class for the tree
*/var Tree=function(){//reads the input and convers it to a tree
function Tree(input){_classCallCheck(this,Tree);console.log("Constructing tree");this.root=new TreeNode(input);console.log("Calculating values");this.root.__calculateHeight();this.root.__calculateDepth();this.root.__calculateSubtreeNodeCount();this.depth=this.root.getHeight();console.log("Tree constructed")}//recalculates all the values of the tree
_createClass(Tree,[{key:"__recalculateValues",value:function __recalculateValues(){this.root.__calculateDepth();this.root.__calculateHeight();this.root.__calculateSubtreeNodeCount()}//sets the root of the tree
},{key:"__setRoot",value:function __setRoot(rootinput){this.root=rootinput;rootinput.__setTree(this);return this}//gets the root of the tree
},{key:"getRoot",value:function getRoot(){return this.root}//returns the height of the tree
},{key:"getHeight",value:function getHeight(){return this.depth}//returns the depth of the tree
},{key:"getDepth",value:function getDepth(){return this.depth}}]);return Tree}();window.Tree=Tree;/*
	Alex Thieme
	30-04-2018
	
*//*
	main node class for storing node information
*/var TreeNode=function(){//TODO
//END TODO
//creates the next node of the tree, recursively creating its children
//sets parent and adds this node to the parent's children
function TreeNode(input,inputparent){_classCallCheck(this,TreeNode);this.depth;this.height;this.value;this.shapes={};this.children=[];this.deletelistener=[];this.addlistener=[];this.insertlistener=[];if(inputparent){this.parentnode=inputparent;this.parentnode.__addChild(this)}//set the name, value and data of the note
if(input.name)this.__setName(input.name);if(input.value)this.__setvalue(input.value);if(input.data)this.__setData(input.data);//
if(input.movedchildren){this.children=input.movedchildren;for(var i=0;i<input.movedchildren.length;i++){input.movedchildren.__updateParent(this)}}//recursively call for each child
if(input.children){for(var i=0;i<input.children.length;i++){new TreeNode(input.children[i],this)}}}//set the name of the node
_createClass(TreeNode,[{key:"__setName",value:function __setName(newname){this.name=newname;return this}//get the name of the node
},{key:"getName",value:function getName(){return this.name}//set a node as one of the children
},{key:"__addChild",value:function __addChild(childnode){this.children.push(childnode);return this}//returns the parent
},{key:"getParent",value:function getParent(){return this.parentnode}//adds a node after the tree was already generated
},{key:"addNode",value:function addNode(newnode){this.addednode=new TreeNode(newnode,this);this.updateParentPath();this.addednode.__calculateDepth();this.addednode.__calculateHeight();this.addednode.__calculateSubTreeNodeCount();this.__triggerAddListener();return this}//returns the node if its the root, otherwise recurses towards the root
},{key:"getRoot",value:function(_getRoot){function getRoot(){return _getRoot.apply(this,arguments)}getRoot.toString=function(){return _getRoot.toString()};return getRoot}(function(){if(this.parentnode!=undefined)return getRoot(parentnode);else return this})//sets the tree, only used on the root
},{key:"__setTree",value:function __setTree(treeinput){this.tree=treeinput;return this}//returns the tree this node belongs to, via the root node where its stored
},{key:"getTree",value:function getTree(){if(this.tree)return this.tree;else return this.getRoot().getTree()}//returns the children in a list
},{key:"getChildren",value:function getChildren(){return this.children}//removes a child from the list
},{key:"__removeChild",value:function __removeChild(oldchild){var index=this.children.indexOf(oldchild);this.children.splice(index,1)}//adds a shape to represent the node
},{key:"addShape",value:function addShape(visualisation,newshape){this.shapes[visualisation]=newshape;return this}//removes a shape from representing the node
},{key:"removeShape",value:function removeShape(visualisation){if(this.shapes[visualisation])this.shapes[visualisation]=undefined;return this}//returns the list of shapes associated with this node
},{key:"getShapes",value:function getShapes(){return this.shapes}//returns the shape of the visualisation, if existing
},{key:"getShape",value:function getShape(visualisation){if(this.shapes[visualisation])return this.shapes[visualisation];else return}//forwards a function to all shapes assigned to this node
},{key:"forwardToShapes",value:function forwardToShapes(forwardfunction,argument){var keys=Object.keys(this.shapes);for(i=0;i<keys.length;i++){forwardfunction.apply(shapes[keys[i]],argument)}}//sets the value of the node
},{key:"__setValue",value:function __setValue(newvalue){this.value=newvalue;return this}//gets the value of the node
},{key:"getValue",value:function getValue(){return this.value}//gets the smallest child
},{key:"getSmallestChild",value:function getSmallestChild(){var smallest;for(var i=0;i<children.length;i++){if(!smallest.getValue())smallest=children[i];if(smallest.getValue()>children[i].getValue())smallest=children[i]}return smallest}//returns the largest childgetSmallestChild(){
},{key:"getLargestChild",value:function getLargestChild(){var largest;for(var i=0;i<children.length;i++){if(!largest.getValue())largest=children[i];if(largest.getValue()<children[i].getValue())largest=children[i]}return largest}//recursively calculates the depth of the node
},{key:"__calculateDepth",value:function __calculateDepth(){if(this.parentnode){this.depth=this.parentnode.getDepth()+1}else{this.depth=1}if(this.children.length>0){for(var i=0;i<this.children.length;i++){this.children[i].__calculateDepth()}}}//returns the depth of the node
},{key:"getDepth",value:function getDepth(){return this.depth}//recursively calculates the height of the node
},{key:"__calculateHeight",value:function __calculateHeight(){this.largestheight=0;if(this.children.length>0){for(var i=0;i<this.children.length;i++){this.children[i].__calculateHeight();if(this.largestheight<this.children[i].getHeight())this.largestheight=this.children[i].getHeight()}}this.height=this.largestheight+1;return this}//returns the height of the node
},{key:"getHeight",value:function getHeight(){return this.height}//recursively calculates the amount of nodes in subtrees rooted at a node
},{key:"__calculateSubtreeNodeCount",value:function __calculateSubtreeNodeCount(){this.subtreenodecount=1;if(this.children.length>0){for(var i=0;i<this.children.length;i++){this.children[i].__calculateSubtreeNodeCount();this.subtreenodecount=this.subtreenodecount+this.children[i].getSubtreeNodeCount()}}return this}//returns the amount of nodes in the subtree rooted at this node
},{key:"getSubtreeNodeCount",value:function getSubtreeNodeCount(){return this.subtreenodecount}//sets the data of this node
},{key:"__setData",value:function __setData(inputdata){this.data=inputdata;return this}//returns the data of this node
},{key:"getData",value:function getData(){return this.data}//inserts a node between this and its children
},{key:"insertNode",value:function insertNode(insert){this.insert.movedchildren=this.children;this.children=[insert];new TreeNode(insert,this);this.__updateParentPath();this.__calculateDepth();this.__triggerInsertListener()}//updates the parent of a node
},{key:"__updateParent",value:function __updateParent(newparent){this.parentnode=newparent}//deletes a node, the recalculates the missing values
},{key:"deleteNode",value:function deleteNode(){for(var i=0;i<children.length;i++){this.parentnode.addChild(this.children[i]);this.children[i].__updateParent(this.parentnode)}this.parentnode.__removeChild(this);this.__updateParentPath();this.__calculateDepth();this.__triggerDeleteListener()}//increases the variables of higher nodes when a node was added
},{key:"__updateParentPath",value:function __updateParentPath(){this.subtreenodecount=1;if(this.children.length>0){for(var i=0;i<this.children.length;i++){this.subtreenodecount=this.subtreenodecount+this.children[i].getSubtreeNodeCount()}}this.__recalculateHeight()}//recalculates the height
},{key:"__recalculateHeight",value:function __recalculateHeight(){this.largestheight=0;if(this.children.length>0){for(var i=0;i<this.children.length;i++){if(this.largestheight<this.children[i].getHeight())this.largestheight=this.children[i].getHeight()}}this.height=this.largestheight+1;return this}//adds a function to the addlistener
},{key:"addAddListener",value:function addAddListener(listener){this.addlistener.push(listener)}//removes a function from the addlistener
},{key:"deleteAddListener",value:function deleteAddListener(listener){var index=this.addListener.indexOf(listener);if(index!=-1)this.addListener.splice(index,1)}//triggers the addlistener
},{key:"__triggerAddListener",value:function __triggerAddListener(){for(var i=0;i<this.addListener.length;i++){this.addListener[i].apply(this,arguments)}return this}//adds a function to the deletelistener
},{key:"addDeleteListener",value:function addDeleteListener(listener){this.deletelistener.push(listener)}//removes a function from the deletelistener
},{key:"deleteDeleteListener",value:function deleteDeleteListener(listener){var index=this.deleteListener.indexOf(listener);if(index!=-1)this.deleteListener.splice(index,1)}//triggers the deletelistener
},{key:"__triggerDeleteListener",value:function __triggerDeleteListener(){for(var i=0;i<this.deleteListener.length;i++){this.deleteListener[i].apply(this,arguments)}return this}//adds a function to the insertlistener
},{key:"addInsertListener",value:function addInsertListener(listener){this.insertlistener.push(listener)}//removes a function from the insertlistener
},{key:"deleteInsertListener",value:function deleteInsertListener(listener){var index=this.insertListener.indexOf(listener);if(index!=-1)this.insertListener.splice(index,1)}//triggers the insertlistener
},{key:"__triggerInsertListener",value:function __triggerInsertListener(){for(var i=0;i<this.insertListener.length;i++){this.insertListener[i].apply(this,arguments)}return this}}]);return TreeNode}();})();