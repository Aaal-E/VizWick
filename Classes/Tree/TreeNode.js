/*
	Alex Thieme
	30-04-2018
	
*/

/*
	main node class for storing node information
*/
class TreeNode{

	//TODO
	//END TODO

	//creates the next node of the tree, recursively creating its children
	//sets parent and adds this node to the parent's children
	constructor(input, inputparent){
		this.depth
		this.height
		this.value
		this.shapes = {};
		this.children = [];
		if(inputparent){
			this.parentnode = inputparent;
			this.parentnode.__addChild(this);
		}
		
		//set the name, value and data of the note
		if (input.name) this.__setName(input.name);
		if (input.value) this.__setvalue(input.value);
		if (input.data) this.__setData(input.data);
		
		//recursively call for each child
		if (input.children){
			for(var i=0; i<input.children.length; i++){	
				new TreeNode(input.children[i], this);
			}
		}
	}
	
	//set the name of the node
	__setName(newname){
		this.name = newname;
		return this;
	}
	
	//get the name of the node
	getName(){
		return this.name;
	}
	
	//set a node as one of the children
	__addChild(childnode){
		this.children.push(childnode);
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
	__setTree(treeinput){
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
	removeShape(visualisation){
		if(this.shapes[visualisation])
			this.shapes[visualisation] = undefined;
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
	__setValue(newvalue){
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
	__calculateDepth(){
		if(this.parentnode){
			this.depth = this.parentnode.getDepth() + 1
		}else{
			this.depth=1
		}
		if(this.children.length>0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].__calculateDepth();
			}
		}
	}
	
	//returns the depth of the node
	getDepth(){
		return this.depth;
	}
	
	//recursively calculates the height of the node
	__calculateHeight(){
		this.largestheight = 0
		if(this.children.length>0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].__calculateHeight();
				if(this.largestheight < this.children[i].getHeight())
					this.largestheight = this.children[i].getHeight();
			}
		}
		this.height = this.largestheight + 1;
		
		return this;
	}
	
	//returns the height of the node
	getHeight(){
		return this.height;
	}	
	
	//recursively calculates the amount of nodes in subtrees rooted at a node
	__calculateSubtreeNodeCount(){
		this.subtreenodecount = 1;
		if(this.children.length > 0){
			for(var i=0; i<this.children.length;i++){
				this.children[i].__calculateSubtreeNodeCount()
				this.subtreenodecount = this.subtreenodecount + this.children[i].getSubtreeNodeCount()
			}
		}
		return this;
	}
	
	//returns the amount of nodes in the subtree rooted at this node
	getSubtreeNodeCount(){
		return this.subtreenodecount
	}
	
	//sets the data of this node
	__setData(inputdata){
		this.data = inputdata;
		return this;
	}
	
	//returns the data of this node
	getData(){
		return this.data;
	}
	
	
	
	
	
	
	
	
	
	
	
	
}