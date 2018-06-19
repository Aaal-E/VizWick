/*
    Optimized Sunburst Visualisation
    Authors:
        Mehrdad Farsadyar
        Tar van Krieken
        Mara Miulescu

    Starting Date: 25/05/2018
*/

/*
**** ALL ENCASED IN A FUNCTION IN ORDER TO KEEP VARIABLES HIDDEN/LOCAL
*/
(function(){
    /*
    **** NodeShape class ****
    */
    class NodeShape extends VIZ2D.NodeShape{
        //
        constructor(gfx, node){
            super(gfx, node);
            //A NODESHAPE DOESN'T RENDER ANYTHING; MUST ADD SHAPES TO IT TO DISPLAY
            this.radialBand = new VIZ2D.RadialBand(gfx, 0, 30, 0, 2*Math.PI, 0xff0000);
            this.addShape(this.radialBand);

            //FOCUS ON THE SHAPE ON A CLICK EVENT
            this.onClick(function(data){
                if(this.isRoot()){
                    var parentNode = this.getNode().getParent();
                    var parentShape = parentNode && parentNode.getShape(this.getVisualisation().getUID());
                    if(parentShape) parentShape.focus();
                }else{
                    this.focus();
                }
                return true; //CATCH THE EVENT
            });

            //WHEN YOU HOVER ON THE NODE
            this.onHover(function(over){
                if (over) {
                    this.highlight();
                } else {
                    this.dehighlight();
                }
            });
        }

        //
        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getVisualisation().centeralizeNode(this.getNode());
            }
        }

        /*
        CALCS PDCOUNT (= PARTIAL DESCENDANT COUNT) FOR THIS NODE AND ALL ITS
        DESCENDANTS. IT ALSO SETS THE LAYER NUMBER.
        THE COUNT OF A NODE INCLUDES THE NODE ITSELF. THE METHOD AUTOMATHICALLY
        STOPS WHEN THERE ARE NO MORE NODES AVAILABLE,SO PASSING LAYER IS NOT NECESSARY
        */
        calcPDCount_setLayersNumbers(){
            this.PDCount = 1;
            var childArr = this.getChildren();
            var lhca = this.getVisualisation().layerHeadCountArr;
            for(var i=0; i < childArr.length; i++){
                var layerNumber = childArr[i].layerNumber = this.layerNumber + 1;
                this.PDCount += childArr[i].calcPDCount_setLayersNumbers();
                lhca[layerNumber] = lhca[layerNumber]+1 || 1;
            }
            return this.PDCount;
        }

        //RETURNS THE PDCOUNT
        getPDCount(){
            return this.PDCount;
        }

        // RETURNS PDCOUNT MINUS ONE, SINCE PARENT MUST NOT BE COUNTED IN THE CHILD LAYER
        calcChildLayer_PDCount(){
            if(this.PDCount){
                return this.PDCount -1;
            }
        }

        //CALCULATES THE THICKNESS OF CHILD LAYER
        calcChildLayer_Thickness(){
            var childLayer_Thickness = 60;
            var childLayerPopulation =
                this.getVisualisation().layerHeadCountArr[this.layerNumber + 1];
            var avgPixelPerNode =
                this.radialBand.getOutRadius()*2*Math.PI / childLayerPopulation;
            if (avgPixelPerNode < 2){
                childLayer_Thickness = 120
            } else if (avgPixelPerNode < 8) {
                childLayer_Thickness = 90
            }
            return childLayer_Thickness;
        }

        //SET CHILDREN PROPERTIES: INRADIUS, THICKNESS, STARTANGLE, SIZE,
        setPropertiesDescendants(){
            var nextStartAngle = this.radialBand.getStartAngle();
            var childrenArr = this.getChildren();
            var childlayerThickness = this.calcChildLayer_Thickness();
            for(var i=0; i<childrenArr.length; i++){
                var child = childrenArr[i];
                child.radialBand.resetProperties();
                child.radialBand.setInRadius(this.radialBand.getInRadius() + this.radialBand.getThickness() + 2);
                child.radialBand.setThickness(childlayerThickness);
                child.radialBand.setStartAngle(nextStartAngle);
                var aSize = this.radialBand.getSize()*(child.getPDCount()/this.calcChildLayer_PDCount());
                child.radialBand.setSize(aSize);
                nextStartAngle += aSize; //implementation chosen for speed; could've used child.getEndAngle
                child.setPropertiesDescendants();
                child.radialBand.setColor(new VIZ2D.Color.fromHSV(Math.random(),1,1).getInt());
            };
        }
    }


    /*
    **** OptimizedSunburst visualiszation class ****
    */
    class OptimizedSunburst extends VIZ2D.Visualisation{
        //
        constructor(container, tree, options){
            super(container, tree, options);
            //this.maxNodeCount = 2000;
            //this.visualizationLayers = 6;
            //this.centeralizeNode(tree.getRoot());
            //this.getCamera().setScale(2);
            var focused = VisualisationHandler.getSynchronisationData().focused||tree.getRoot();
            this.synchronizeNode("focused", focused);
        }

        //
        __getNodeShapeClass(){
            return NodeShape;
        }

        /*
        * The options for changing the layer number and max node count
        */
        __setupOptions(options){
            var This = this;
            var refocus = function(){
                var focused = This.getShape("focused");
                if(focused){
                    focused.__show();
                    This.setShapeState("focused", focused);
                }
            };

            //--OPTION FOR RESETING THE VISUALISATION AROUND THE MAIN ROOT
            options.add(new Options.Button("whole").setIcon("dot-circle")
            .setDescription("View the whole visualization").onClick(function(){
                var root = This.getTree().getRoot();
                var rootShape = root && root.getShape(This.getUID());
                if(rootShape) rootShape.focus();
            }));

            //--OPTION FOR CHANGING MAX NODE COUNT--
            options.add(new Options.Number("Maximum node count", 1, 50, 10000)
            .setDescription("The number of nodes showing on the screen")
            .onChange(function(val){
                This.maxNodeCount = val;
                refocus();
            }).setValue(1500));

            //--OPTION FOR CHANGING LAYER NUMBERS--
            options.add(new Options.Number("Number of layers")
            .setDescription("The number of layers shown").onChange(function(val){
                This.visualizationLayers = val;
                refocus();
            }).setValue(5));
        }

        //SET A NODE AS A NEW CENTER AND THEN BUILD VISUALISATION AROUND IT
        centeralizeNode(node){
            //stops rendering all visible nodeshapes
            var nodeShapeArr = this.getShapes();
            for (var i=nodeShapeArr.length-1; i >= 0; i--){
                nodeShapeArr[i].remove()
            }
            //RESET THE ARRAY layerHeadCountArr IF IT EXISTS
            if (this.layerHeadCountArr != null){
                this.layerHeadCountArr.length = 0
            } else{
                this.layerHeadCountArr = [];
            }
            //BUILD THE VIUSALISATION AROUND THE NEW CENTER
            var centerNode = this.createNodeShape(node).add();
            centerNode.layerNumber = 0;
            this.layerHeadCountArr[0] = 1;
            //MAKE THE CENTER NODE CIRCLE
            centerNode.radialBand.setStartAngle(0);
            centerNode.radialBand.setInRadius(0);
            centerNode.radialBand.setThickness(30);
            centerNode.radialBand.setSize(2*Math.PI);
            //CREATE THE DESCENDANTS
            centerNode.createDescendants(this.visualizationLayers);
            //REMOVE THE OUTER LAYER NODES BCZ OF INCOMPLETNESS CAUSED BY REACHING THE MAXNODECOUNT
            // var nodeShapeArr = this.getShapes();
            // var outerLayerDepth = nodeShapeArr[nodeShapeArr.length-1].getDepth();
            // for (var i=nodeShapeArr.length-1; i >= 0; i--){
            //     var nodeShape = nodeShapeArr[i];
            //     if(nodeShape.getDepth()!=outerLayerDepth)
            //         break;
            //     nodeShape.remove();
            // }
            //SET PDCOUNT AND LAYERNUMBER FOR THIS NODESHAPE AND ITS DESCENDANTS
            centerNode.calcPDCount_setLayersNumbers();
            //SET THE PROPERTIES OF THE DISCENDANTS SO THEY ARE SHOWN ON THE SCREEN
            centerNode.setPropertiesDescendants();
            //console.log(centerNode);

        }
     }


    /*
    **** ATTACH SOME DATA TO BE DISPLAYED ON THE WEBPAGE ****
    */
    OptimizedSunburst.description = {
        name: "Optimized-Sunburst",
        description: "Optimized-Sunburst visualization",
        image: ""
    };


    /*
    **** REGISTER TE CLASS AT "VisualisationHandler" ****
    */
    VisualisationHandler.registerVisualisation(OptimizedSunburst);
})();
