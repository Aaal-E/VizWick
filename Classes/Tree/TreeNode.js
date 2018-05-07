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
		this.deletelistener = [];
		this.addlistener = [];
		this.insertlistener = [];
		if(inputparent){
			this.parentnode = inputparent;
			this.parentnode.__addChild(this);
		}
		
		//set the name, value and data of the note
		if (input.name) this.__setName(input.name);
		if (input.value) this.__setvalue(input.value);
		if (input.data) this.__setData(input.data);
		
		//
		if (input.movedchildren){
			this.children = input.movedchildren;
			for(var i=0; i<input.movedchildren.length; i++){
				input.movedchildren.__updateParent(this);
			}
		}
		
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
	
	//returns the parent
	getParent(){
		return this.parentnode;
	}
	
	//adds a node after the tree was already generated
	addNode(newnode){
		
		this.addednode = new TreeNode(newnode, this);
		this.updateParentPath();
		this.addednode.__calculateDepth();
		this.addednode.__calculateHeight();
		this.addednode.__calculateSubTreeNodeCount();
		this.__triggerAddListener();
		return this
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
	
	//removes a child from the list
	__removeChild(oldchild){
		var index = this.children.indexOf(oldchild);
		this.children.splice(index,1);
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
	
	//forwards a function to all shapes assigned to this node
	forwardToShapes(forwardfunction, argument){
		var keys = Object.keys(this.shapes)
		for (i=0; i<keys.length; i++){
			forwardfunction.apply(shapes[keys[i]], argument);
		}
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
				this.subtreenodecount = this.subtreenodecount + this.children[i].getSubtreeNodeCount();
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
	
	//inserts a node between this and its children
	insertNode(insert){
		this.insert.movedchildren = this.children;
		this.children = [insert];
		new TreeNode(insert, this);
		this.__updateParentPath();
		this.__calculateDepth();
		this.__triggerInsertListener();
	}
	
	//updates the parent of a node
	__updateParent(newparent){
		this.parentnode = newparent; 
	}
	
	//deletes a node, the recalculates the missing values
	deleteNode(){
		for(var i=0; i<children.length; i++){
			this.parentnode.addChild(this.children[i]);
			this.children[i].__updateParent(this.parentnode);
		}
		this.parentnode.__removeChild(this);
		this.__updateParentPath();
		this.__calculateDepth();
		this.__triggerDeleteListener();
	}
	
	//increases the variables of higher nodes when a node was added
	__updateParentPath(){
		this.subtreenodecount = 1;
		if(this.children.length > 0){
			for(var i=0; i<this.children.length;i++){
				this.subtreenodecount = this.subtreenodecount + this.children[i].getSubtreeNodeCount();
			}
		}
		this.__recalculateHeight();
	}
	
	//recalculates the height
	__recalculateHeight(){
		this.largestheight = 0
		if(this.children.length>0){
			for(var i=0; i<this.children.length; i++){
				if(this.largestheight < this.children[i].getHeight())
					this.largestheight = this.children[i].getHeight();
			}
		}
		this.height = this.largestheight + 1;
		
		return this;
	}
	
	//adds a function to the addlistener
	addAddListener(listener){
		this.addlistener.push(listener);
	}
	
	//removes a function from the addlistener
	deleteAddListener(listener){
		var index = this.addListener.indexOf(listener);
        if(index!=-1) this.addListener.splice(index, 1);
	}
	
	//triggers the addlistener
	__triggerAddListener(){
		for(var i=0; i<this.addListener.length; i++)
            this.addListener[i].apply(this, arguments);
        return this;
	}
	
	//adds a function to the deletelistener
	addDeleteListener(listener){
		this.deletelistener.push(listener);
	}
	
	//removes a function from the deletelistener
	deleteDeleteListener(listener){
		var index = this.deleteListener.indexOf(listener);
        if(index!=-1) this.deleteListener.splice(index, 1);
	}
	
	//triggers the deletelistener
	__triggerDeleteListener(){
		for(var i=0; i<this.deleteListener.length; i++)
            this.deleteListener[i].apply(this, arguments);
        return this;
	}
	
	//adds a function to the insertlistener
	addInsertListener(listener){
		this.insertlistener.push(listener);
	}
	
	//removes a function from the insertlistener
	deleteInsertListener(listener){
		var index = this.insertListener.indexOf(listener);
        if(index!=-1) this.insertListener.splice(index, 1);
	}
	
	//triggers the insertlistener
	__triggerInsertListener(){
		for(var i=0; i<this.insertListener.length; i++)
            this.insertListener[i].apply(this, arguments);
        return this;
	}
	
	
	
	
	
	
	
	
	
	
}