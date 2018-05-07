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
		this.root = new TreeNode(input);
		console.log("Calculating values");
		this.root.__calculateHeight();
		this.root.__calculateDepth();
		this.root.__calculateSubtreeNodeCount();
		this.depth = this.root.getHeight()
		console.log("Tree constructed");
	}
	
	//recalculates all the values of the tree
	__recalculateValues(){
		this.root.__calculateDepth();
		this.root.__calculateHeight();
		this.root.__calculateSubtreeNodeCount();
	}
	
	//sets the root of the tree
	__setRoot(rootinput){
		this.root = rootinput;
		rootinput.__setTree(this);
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