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
	addShape(newshape){
		shapes.add(newshape);
	}
	
	//removes a shape from representing the node
	removeShape(oldshape){
		if(shapes.has(oldshape)
			shapes.delete(oldshape);
	}
	
	//sets the value of the node
	setValue(newvalue){
		this.value = newvalue;
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
				smallest = children.get(i);
			if(smallest.getValue() > children.get(i).getValue())
				smallest = children.get(i);
		}
		return smallest;
	}
	
	//returns the largest childgetSmallestChild(){
	getLargestChild(){
		var largest
		for (var i = 0; i < children.length; i++){
			if(!largest.getValue())
				largest = children.get(i);
			if(largest.getValue() < children.get(i).getValue())
				largest = children.get(i);
		}
		return largest;
	}
	
	//recursively calculates the depth of the node
	calculateDepth(){
		if(parentnode){
			this.depth = this.parentnode.getDepth() + 1
			for(var i=0; i<children.length; i++){
				children.get(i).calculateDepth();
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
			for(var i='; i<children.length; i++){
				children.get(i).calculateHeight();
				if(!largestheight)
					largestheight = children.get(i).getHeight();
				if(largestheight < children.get(i).getHeight();
					largestheight = children.get(i).getHeight();
			}
			this.height = largestheight + 1;
		}else{
			this.height = 1;
	}
	
	//returns the height of the node
	getHeight(){
		return this.height;
	}	
	
	
	
	
	
	
	
	
}