/*
    Optimized Sunburst Visualisation
    Authors:

    Starting Date: 25/05/2018
*/

/*
**** All encased in a function in order to keep variables hidden/local
*/
(function(){
    /*
    **** NodeShape class ****
    */
    class NodeShape extends VIZ2D.NodeShape{
        //
        constructor(gfx, node){
            super(gfx, node); //We forward the it in the constructor, in order to save it as an object field
            //A nodeshape doesn't render anything, so we must add shapes to it to display
            this.radialBand = new VIZ2D.RadialBand(gfx, 0, 10, this.calcRadian(0), this.calcRadian(360),
                0xff0000);
            this.addShape(this.radialBand);

            //Focus on the shape on a click event
            this.onClick(function(data){
                this.focus();
            });
        }

        //In case in future setting location of shapes becomes an issue
        // __connectParent(parent){
        //     if(parent){ //doesn't have a parent if root
        //     }
        // }


        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getVisualisation().centeralizeNode(this);
            }
        }

        //calcs PDCount (= Partial Descendant Count) for this node and all its descendants.
        //The count of a node includes the node itself
        //The method automathically stops when there are no more nodes available,
        //so passing layer is not necessary
        calcPDCount(){
            this.PDCount = 1;
            for(child of this.getChildren()){
                this.PDCount += child.calcPDCount();
            }
            return this.PDCount;
        }

        //returns the PDCount
        getPDCount(){
            return this.PDCount;
        }

        // returns PDCount minus one, since parent must not be counted in the child layer
        calcChildLayer_PDCount(){
            if(this.PDCount){
                return this.PDCount -1;
            }
        }

        //For now it retruns 50 for all nodes. Possible to make it dynamic
        calcChildLayer_Thickness(){
            return 50;
        }

        //set children properties: inRadius, thickness, startAngle, size,
        setPropertiesDescendants(){
            var nextStartAngle = 0;
            for(child of this.getChildren()){
                // child.resetProperties(); //implement this
                child.setInRadius(this.radialBand.getInRadius() + this.radialBand.getThickness());
                child.setThickness(this.calcChildLayer_Thickness());
                child.setStartAngle(nextStartAngle);
                var aSize = (child.getPDCount()/this.calcChildLayer_PDCount())*this.calcRadian(360);
                child.setSize(aSize);
                nextStartAngle += aSize; //implementation chosen for speed; could've used child.getEndAngle
                child.setPropertiesDescendants();
            };
        }

        //returns the radian of a given digree
        calcRadian(degree){
            return ((Math.PI)/180)*degree;
        }
    }


    /*
    **** OptimizedSunburst visualiszation class ****
    */
    class OptimizedSunburst extends VIZ2D.Visualisation{
        //
        constructor(container, tree, options){
            super(container, tree, options);
            this.centeralizeNode(tree.getRoot());
        }

        //
        __getNodeShapeClass(){
            return NodeShape;
        }

        //
        __setupOptions(options){
            var This = this;
            options.add(new Options.Button("center").onClick(function(){
                This.synchronizeNode("focused", This.getTree().getRoot());
            }));
        }

        //Set a node as a new center and the build visualisation around it
        centeralizeNode(node){
            var layers = 10;
            //stops rendering all visible nodeshapes
            for (var nodeshape of this.getShapesNode()){
                nodeshape.remove()
            }
            //build the viusalisation around the new center
            var centerNode = this.createNodeShape(node);
            centerNode.createDescendants(layers);
            centerNode.calcPDCount(); //as a result PDCount is calculated for the node and all its descendants
            //"PDCount" stands for "partial descendants count"
            centerNode.setPropertiesDescendants();
        }
    }


    /*
    **** Attach some data to be displayed on the webpage ****
    */
    OptimizedSunburst.description = {
        name: "Optimized-Sunburst",
        description: "Optimized-Sunburst visualization",
        image: ""   //should contain some image path relative to the page
    };


    /*
    **** Register te class at "VisualisationHandler" ****
    */
    VisualisationHandler.registerVisualisation(OptimizedSunburst);
})();
