/*
    Optimized Sunburst Visualisation
    Authors:
        Mehrdad Farsadyar
        Tar van Krieken
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
            super(gfx, node);
            //A nodeshape doesn't render anything; must add shapes to it to display
            this.radialBand = new VIZ2D.RadialBand(gfx, 0, 25, this.calcRadian(0), this.calcRadian(360),
                0xff0000);
            this.addShape(this.radialBand);

            //Focus on the shape on a click event
            this.onClick(function(data){
                this.focus();
            });
        }

        //
        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getVisualisation().centeralizeNode(this.getNode());
            }
        }

        /*
        calcs PDCount (= Partial Descendant Count) for this node and all its
        descendants. It also sets the layer number.
        The count of a node includes the node itself. The method automathically
        stops when there are no more nodes available,so passing layer is not necessary
        */
        calcPDCount_setLayersNumbers(){
            this.PDCount = 1;
            var childArr = this.getChildren();
            var lhca = this.getVisualisation().layerHeadCountArr;
            for(var i=0; i < childArr.length; i++){
                var child = childArr[i];
                var layerNumber = child.layerNumber = this.layerNumber + 1;
                this.PDCount += child.calcPDCount_setLayersNumbers();
                child.layerIndex = lhca[layerNumber] = lhca[layerNumber]+1 || 1;
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

        //calculates the thickness of child layer
        calcChildLayer_Thickness(){
            var childLayer_Thickness = 50;
            var childLayerPopulation =
                this.getVisualisation().layerHeadCountArr[this.layerNumber + 1];
            // console.log(childLayerPopulation);
            var avgPixelPerNode =
                this.radialBand.getOutRadius()*2*Math.PI / childLayerPopulation;
            if (avgPixelPerNode < 2){
                childLayer_Thickness = 120
            } else if (avgPixelPerNode < 10) {
                childLayer_Thickness = 100
            }
            return childLayer_Thickness;
        }

        //set children properties: inRadius, thickness, startAngle, size,
        setPropertiesDescendants(){
            var nextStartAngle = this.radialBand.getStartAngle();
            var childrenArr = this.getChildren();
            var childlayerThickness = this.calcChildLayer_Thickness();
            var parentColor = VIZ2D.Color.fromInt(this.radialBand.getColor());
            for(var i=0; i<childrenArr.length; i++){
                var child = childrenArr[i];
                child.radialBand.resetProperties();
                child.radialBand.setInRadius(this.radialBand.getInRadius() + this.radialBand.getThickness() + 2);
                child.radialBand.setThickness(childlayerThickness);
                child.radialBand.setStartAngle(nextStartAngle);
                var aSize = this.radialBand.getSize()*(child.getPDCount()/this.calcChildLayer_PDCount());
                child.radialBand.setSize(aSize);

                var avgAngle = nextStartAngle+aSize/2;
                // var hue = (avgAngle/2+Math.PI*(child.layerIndex%2))/(Math.PI*2)%1;
                var hue = (avgAngle+1.8*(child.layerIndex%2))/(Math.PI*2)%1;
                var color = VIZ2D.Color.fromHSV(hue,1,1);
                child.radialBand.setColor(color.mix(parentColor, 0.2).getInt());
                // child.radialBand.setColor(VIZ2D.Color.fromHSV(Math.random(),1,1).getInt());


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
            this.maxNodeCount = 2000;
            this.centeralizeNode(tree.getRoot(), 7);
        }

        //
        __getNodeShapeClass(){
            return NodeShape;
        }

        /*
        The options for recentering on main root, as well as recentering on the
        parent of a node.
        */
        __setupOptions(options){
            var This = this;
            options.add(new Options.Button("center").onClick(function(){
                This.synchronizeNode("focused", This.getTree().getRoot());
            }));
        }

        //Set a node as a new center and then build visualisation around it
        centeralizeNode(node, layers){
            var layers = layers;
            //stops rendering all visible nodeshapes
            var nodeShapeArr = this.getShapes();
            for (var i=nodeShapeArr.length-1; i >= 0; i--){
                nodeShapeArr[i].remove()
            }
            //reset the array layerHeadCountArr if it exists
            if (this.layerHeadCountArr != null){
                this.layerHeadCountArr.length = 0
            } else{
                this.layerHeadCountArr = [];
            }
            //build the viusalisation around the new center
            var centerNode = this.createNodeShape(node).add();
            centerNode.layerNumber = 0;
            this.layerHeadCountArr[0] = 1;
            centerNode.createDescendants(layers);
            //remove the outer layer nodes since that layer is incomplete due to
            //reaching the maxNodeCount
            var nodeShapeArr = this.getShapes();
            var outerLayerDepth = nodeShapeArr[nodeShapeArr.length-1].getDepth();
            for (var i=nodeShapeArr.length-1; i >= 0; i--){
                var nodeShape = nodeShapeArr[i];
                if(nodeShape.getDepth()!=outerLayerDepth)
                    break;
                nodeShape.remove();
            }
            //set PDCount and layernumber for this nodeshape and its descendants
            centerNode.calcPDCount_setLayersNumbers();
            //set the properties of the discendants so they are shown on the screen
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
