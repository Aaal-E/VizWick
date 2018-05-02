/*
	Alex Thieme
	30-04-2018
	
*/

/*
	main node class for storing node information
*/
class TreeNode{

	//TODO
	//ADD AMOUNT OF NODES IN SUBTREE
	//END TODO

	
	//sets parent and adds this node to the parent's children
	constructor(inputparent){
		this.depth
		this.height
		this.value
		this.shapes = new List();
		this.parentnode;
		this.children = new List();
		if(inputparent){
		this.parentnode = inputparent;
		this.parentnode.addChild(this);
		}
	}
	
	//set the name of the node
	setName(newname){
		this.name = newname;
		return this;
	}
	
	//get the name of the node
	getName(){
		return this.name;
	}
	
	//set a node as one of the children
	addChild(childnode){
		this.children.add(childnode);
		return this;
	}
	
	//returns the node if its the root, otherwise recurses towards the root
	getRoot(){
		if(this.parentnode != undefined)
			return getRoot(parentnode);
		else
			return this;
	}
	
	//sets the tree, only used on the root
	setTree(treeinput){
		this.tree = treeinput;
		return this;
	}
	
	//returns the tree this node belongs to, via the root node where its stored
	getTree(){
		if (this.tree) 
			return this.tree;
		else
			return this.getRoot().getTree();
	}
	
	//returns the children in a list
	getChildren(){
		return this.children;
	}
	
	//adds a shape to represent the node
	addShape(visualisation, newshape){
		this.shapes[visualisation] = newshape;
		return this;
	}
	
	//removes a shape from representing the node
	removeShape(oldshape){
		if(this.shapes.has(oldshape)
			this.shapes.delete(oldshape);
		return this;
	}
	
	//returns the list of shapes associated with this node
	getShapes(){
		return this.shapes
	}
	
	//returns the shape of the visualisation, if existing
	getShape(visualisation){
		if (this.shapes[visualisation])
			return this.shapes[visualisation];
		else
			return;
	}
	
	//sets the value of the node
	setValue(newvalue){
		this.value = newvalue;
		return this;
	}
	
	//gets the value of the node
	getValue(){
		return this.value;
	}
	
	//gets the smallest child
	getSmallestChild(){
		var smallest
		for (var i = 0; i < children.length; i++){
			if(!smallest.getValue())
				smallest = children[i];
			if(smallest.getValue() > children[i].getValue())
				smallest = children[i];
		}
		return smallest;
	}
	
	//returns the largest childgetSmallestChild(){
	getLargestChild(){
		var largest
		for (var i = 0; i < children.length; i++){
			if(!largest.getValue())
				largest = children[i];
			if(largest.getValue() < children[i].getValue())
				largest = children[i];
		}
		return largest;
	}
	
	//recursively calculates the depth of the node
	calculateDepth(){
		if(parentnode){
			this.depth = this.parentnode.getDepth() + 1
			for(var i=0; i<children.length; i++){
				children[i].calculateDepth();
			}
		}else{
			this.depth=1
		}
	}
	
	//returns the depth of the node
	getDepth(){
		return this.depth;
	}
	
	//recursively calculates the height of the node
	calculateHeight(){
		if(children.length>0){
			var largestheight
			for(var i=0; i<children.length; i++){
				children[i].calculateHeight();
				if(!largestheight)
					largestheight = children[i].getHeight();
				if(largestheight < children[i].getHeight();
					largestheight = children[i].getHeight();
			}
			this.height = largestheight + 1;
		}else{
			this.height = 1;
		}
		return this;
	}
	
	//returns the height of the node
	getHeight(){
		return this.height;
	}	
	
	//recursively calculates the amount of nodes in subtrees rooted at a node
	calculateSubtreeNodeCount(){
		this.subtreenodecount = 1;
		if(children.length > 0){
			for(var i=0; i<children.length;i++){
				children[i].calculateSubtreeNodeCount()
				this.subtreenodecount = this.subtreenodecount + children[i].getSubtreeNodeCount()
			}
		}
		return this;
	}
	
	//returns the amount of nodes in the subtree rooted at this node
	getSubtreeNodeCount(){
		return this.subtreenodecount
	}
	
	//sets the data of this node
	setData(inputdata){
		this.data = inputdata;
		return this;
	}
	
	//returns the data of this node
	getData(){
		return this.data;
	}
	
	
	
	
	
	
	
	
	
	
	
	
}