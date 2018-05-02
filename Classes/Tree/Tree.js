/*
	Alex Thieme
	30-04-2018
	
*/

/*
	main class for the tree
*/
class Tree{
	
	//reads the input and convers it to a tree
	constructor(input){
		console.log("Constructing tree");
		__createNode(input);
		console.log("Calculating values");
		root.__calculateHeight();
		root.__calculateDepth();
		root.__calculateSubtreeNodeCount();
		this.depth = root.getHeight()
		console.log("Tree constructed");
	}
	
	//creates the next node of the tree, recursively creating its children
	__createNode(input, parentnode){
		//create a node for the current instance
		currentnode = new Node(parentnode);
		
		//if this is the first call, make it the root
		if (!parentnode) setRoot(currentnode);
		
		//set the name, value and data of the note
		if (input.name) currentnode.setName(input.name);
		if (input.value) currentnode.setvalue(input.value);
		if (input.data) currentnode.setData(input.data);
		
		//recursively call for each child
		for(var i=0; i<input.children.length; i++){	
			__createNode(input.children.get(i), currentnode);
		}
		return this;
	}
	
	//sets the root of the tree
	__setRoot(rootinput){
		this.root = rootinput;
		rootinput.setTree(this);
		return this;
	}
	
	//gets the root of the tree
	getRoot(){
		return this.root;
	}
	
	//returns the height of the tree
	getHeight() {
		return this.depth;
	}
	
	//returns the depth of the tree
	getDepth() {
		return this.depth;
	}
}