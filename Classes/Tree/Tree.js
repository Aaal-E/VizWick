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
		createNode(input);
		root.calculateHeight();
		root.calculateDepth();
	}
	
	//creates the next node of the tree, recursively creating its children
	createNode(input, parentnode){
		//create a node for the current instance
		currentnode = new Node(parentnode);
		
		//if this is the first call, make it the root
		if (!parentnode) setRoot(currentnode);
		
		//set the name and value of the note
		if (input.name) currentnode.setName(input.name);
		if (input.value) currentnode.setvalue(input.value);
		
		//recursively call for each child
		for(var i=0; i<input.children.length; i++){	
			createNode(input.children.get(i), currentnode);
		}
		return this;
	}
	
	//sets the root of the tree
	setRoot(rootinput){
		this.root = rootinput;
		rootinput.setTree(this);
		return this;
	}
	
	//gets the root of the tree
	getRoot(){
		return this.root;
	}
	
}