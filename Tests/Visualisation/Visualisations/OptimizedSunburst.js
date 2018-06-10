/*
    Optimized Sunburst Visualisation
    Authors:
        Mehrdad Farsadyar
        Mara Miulescu
        
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
            this.radialBand = new VIZ2D.RadialBand(gfx, 0, 25, this.calcRadian(0), this.calcRadian(360),
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

        //
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
            var childArr = this.getChildren();
            for(var i=0; i < childArr.length; i++){
                this.PDCount += childArr[i].calcPDCount();
            }
            return this.PDCount;
        }


        //THIS METHOD IS STILL TO BE COMPLETED LATER BY MEHRDAD
        /*
        calcChildLayer_headCount(){
            this.ChildLayer_headCount = 1;
            var SiblingsArr = this.getParent().getparent().getChildren();
            for (var i = 0; i < SiblingsArr.length, i++){
                var sibling = SiblingsArr[i];
                var childArr = sibling.getChildren();
                for(var i=0; i < childArr.length; i++){
                    this.ChildLayer_headCount += (childArr[i].getChildren()).length;
                }
            }
            return this.ChildLayer_headCount;
        */

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

        //THIS METHOD IS STILL WORK IN PROGRESS; YET TO BE COMPLETED LATER BY MEHRDAD
        //For now it retruns 80 for all nodes.
        calcChildLayer_Thickness(){
            // FOR MEHRDAD: PASS THESE AS ARGUMENTS: layerCount, parentSize, inRadius
            var minimumThickness = 80;
            var aThickness = minimumThickness;
            // var density = parentSize*inRadius/layerCount;
            // var aThickness = minimumThickness;
            // if (density < 5){
            //     aThickness = 100;
            // // } else if (density < 2) {
            // //     aThickness = 80;
            // // } else if (density < 1.5) {
            // //     aThickness = 60;
            // // } else if (density < 2) {
            // //     aThickness = 40;
            // }
        return aThickness;
    }

        //set children properties: inRadius, thickness, startAngle, size,
        setPropertiesDescendants(){
            var nextStartAngle = this.radialBand.getStartAngle();
            var children = this.getChildren();
            var layerThickness =  this.calcChildLayer_Thickness();
            for(var i=0; i<children.length; i++){
                var child = children[i];
                child.radialBand.resetProperties();
                child.radialBand.setInRadius(this.radialBand.getInRadius() + this.radialBand.getThickness());
                child.radialBand.setThickness(layerThickness);
                child.radialBand.setStartAngle(nextStartAngle);
                var aSize = this.radialBand.getSize()*(child.getPDCount()/this.calcChildLayer_PDCount());
                child.radialBand.setSize(aSize);
                nextStartAngle += aSize; //implementation chosen for speed; could've used child.getEndAngle
                child.setPropertiesDescendants();
                child.radialBand.setColor(new VIZ2D.Color.fromHSV(Math.random(), 1, 1).getInt());
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
            var nodeshapeArr = this.getShapesNode();
            for (var i=nodeshapeArr.length-1; i >= 0; i--){
                nodeshapeArr[i].remove()
            }
            //build the viusalisation around the new center
            var centerNode = this.createNodeShape(node).add();
            centerNode.createDescendants(layers);
            //as a result PDCount is calculated for the node and all its descendants:
            centerNode.calcPDCount();
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
