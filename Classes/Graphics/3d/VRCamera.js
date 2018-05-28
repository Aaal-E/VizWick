/*
    global static VR camera class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
var tempMatrix = new THREE.Matrix4(); //used to temporarely store controller raytrace data
var vec3 = new THREE.Vector3(); //also temporary
var quaternion = new THREE.Quaternion(); //also temporary
var euler = new THREE.Euler(); //also temporary
window.VRCamera = new
(class VRCamera3d{
    constructor(){
        this.listeners = {
            available: [],
            connected: [],
            controllerConnected: [],
        };
        this.state = {
            available: false,
            connected: false,
            controller1Connected: false,
            controller2Connected: false,
        };
        this.hmd = null;
        this.controller1 = null;
        this.controller2 = null;
        this.__update = this.__update.bind(this);
        this.transform = {
            scale: 1,
            loc: new XYZ(),
            rot: new Vec(),
        };
        this.transformOffset = { //used while moving the controllers
            scale: 1,
            loc: new XYZ(),
            rot: new Vec(),
        };
        if(this.hasVRSupport()){
            this.__setup();

            //create renderer for VR
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setClearColor("#000000");
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(this.getWidth(), this.getHeight());
            this.renderer.vr.enabled = true;
            this.renderer.vr.standing = true;

            var This = this;
            $(function(){
                var canvas = $(This.renderer.domElement);
                canvas.addClass("VRrenderer");
                $("body").append(canvas);
                // canvas.css("opacity", "0.0");
                canvas.css({"position":"absolute", "left":0, "top":0, "z-index": -1});
            })

            //create scene
            this.scene = new THREE.Scene();
            this.visualisationScene = new THREE.Object3D();

            //create camera (which I don't think it actually uses anyhpw)
            this.camera = new THREE.PerspectiveCamera(75, this.getWidth()/this.getHeight(), 0.1, 1000);
            this.scene.add(this.camera);

            //controller stuff
            this.rayCaster = new THREE.Raycaster();
            this.rayCastGroup = new THREE.Group();
            this.rayCastGroup.add(this.visualisationScene);
            this.scene.add(this.rayCastGroup);
            this.defaultPointerDist = 0.2;
        }
    }

    //general properties
    getWidth(){
        return 192;
    }
    getHeight(){
        return 108;
    }
    hasVRSupport(){
        return !!navigator.getVRDisplays;
    }
    getCanvas(){
        return $(this.renderer.domElement);
    }

    //setup
    __setup(){
        var This = this;
		window.addEventListener('vrdisplayconnect', function(event){
			This.__hmdFound(event.display);
		}, false);

		window.addEventListener('vrdisplaydisconnect', function(event){
			This.__hmdNotFound();
		}, false);

		window.addEventListener('vrdisplaypresentchange', function(event){
			if(event.display.isPresenting)
			    This.__hmdConnected();
			else
			    This.__hmdDisconnected();
		}, false);

		window.addEventListener('vrdisplayactivate', function(event){
			// event.display.requestPresent([{source: renderer.domElement}]);
		}, false);

		window.addEventListener('vr controller connected', function(event){
		    This.__controllerConnected(event.detail);
		});

		navigator.getVRDisplays().then(function(displays){
			if(displays.length>0){
				This.__hmdFound(displays[0]);
			}else{
				This.__hmdNotFound();
			}
		});
    }

    //listeners
    onAvailableListener(listener){
        var index = this.listeners.available.indexOf(listener);
        if(index==-1) this.listeners.available.push(listener);
        listener.call(this, this.state.available);
        return this;
    }
    offAvailableListener(listener){
        var index = this.listeners.available.indexOf(listener);
        if(index!=-1) this.listeners.available.splice(index, 1);
        return this;
    }
    onConnectedListener(listener){
        var index = this.listeners.connected.indexOf(listener);
        if(index==-1) this.listeners.connected.push(listener);
        listener.call(this, this.state.connected);
        return this;
    }
    offConnectedListener(listener){
        var index = this.listeners.connected.indexOf(listener);
        if(index!=-1) this.listeners.connected.splice(index, 1);
        return this;
    }
    onControllerConnectedListener(listener){
        var index = this.listeners.controllerConnected.indexOf(listener);
        if(index==-1) this.listeners.controllerConnected.push(listener);
        listener.call(this, this.state.controllerConnected);
        return this;
    }
    offControllerConnectedListener(listener){
        var index = this.listeners.controllerConnected.indexOf(listener);
        if(index!=-1) this.listeners.controllerConnected.splice(index, 1);
        return this;
    }

    //hmd setup
    __hmdFound(hmd){
        this.hmd = hmd;

        this.state.available = true;
		for(var i=0; i<this.listeners.available.length; i++){
		    this.listeners.available[i].call(this, true);
		}
    }
    __hmdNotFound(){
		this.state.available = false;
		for(var i=0; i<this.listeners.available.length; i++){
		    this.listeners.available[i].call(this, false);
		}
    }
    __hmdConnected(){
		this.state.connected = true;
		for(var i=0; i<this.listeners.connected.length; i++){
		    this.listeners.connected[i].call(this, true);
		}

        this.renderer.vr.setDevice(this.hmd);
        this.renderer.animate(this.__update);
    }
    __hmdDisconnected(){
        this.state.connected = false;
		for(var i=0; i<this.listeners.connected.length; i++){
		    this.listeners.connected[i].call(this, false);
		}

		this.renderer.vr.setDevice(null);
        this.renderer.animate(null);
    }
    __controllerConnected(controller){
        var controllerID =  controller.name.match(/left/i)? 1:
                            controller.name.match(/right/i)? 2:
                            this.state.controller1Connected? 2:1;

        this.state["controller"+controllerID+"Connected"] = true;
        for(var i=0; i<this.listeners.controllerConnected.length; i++){
		    this.listeners.controllerConnected[i].call(this, true, controllerID);
		}

		this["controller"+controllerID] = controller;

		//controller setup
		var This = this;

		//add to scene
		this.scene.add(controller);
		controller.userData.id = controllerID;
		controller.standingMatrix = this.renderer.vr.getStandingMatrix();
		controller.head = this.camera;

		//appearance
		var colors = {
		    line: {
		        normal: 0xff0000,
		        hover: 0xff0000,
		        press: 0xff0000,
		    },
		    pointer: {
		        normal: 0xff0000,
		        hover: 0x0000ff,
		        press: 0x00ff00,
		    }
		};

    	//ray tracing
    	var lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);
    	var lineMaterial = new THREE.LineBasicMaterial({color: colors.line.normal});
		var line = new THREE.Line(lineGeometry, lineMaterial);
		line.scale.z = this.defaultPointerDist;
		controller.add(line);
		controller.userData.line = line;

		var pointerGeometry = new THREE.SphereGeometry(0.015, 32, 32);
		var pointerMaterial = new THREE.MeshPhongMaterial({color: colors.pointer.normal});
		var pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
		pointer.position.z = -this.defaultPointerDist;
		controller.add(pointer);
		controller.userData.pointer = pointer;

		controller.userData.colors = colors;
		controller.userData.pressedButtons = {
		    primary: false,
		    grip: false
		};

    	//events
    	//TODO make sure these event handlers don't remain on controller disconnect
    	controller.addEventListener('primary press began', function(event){
    	    This.__setButtonPressed(controller, "primary");
    	});
    	controller.addEventListener('grip press began', function(event){
    		This.__setButtonPressed(controller, "grip");
    	});
    	controller.addEventListener('primary press ended', function(event){
    		This.__setButtonReleased(controller, "primary");
    	});
    	controller.addEventListener('grip press ended', function(event){
    		This.__setButtonReleased(controller, "grip");
    	});

    	var buttonPress = function(event){
    		This.__setButtonPressed(controller, "rescale");
    	};
    	var buttonRelease =function(event){
    		This.__setButtonReleased(controller, "rescale");
    	};
    	controller.addEventListener('A press began', buttonPress);
    	controller.addEventListener('B press began', buttonPress);
    	controller.addEventListener('X press began', buttonPress);
    	controller.addEventListener('Y press began', buttonPress);

    	controller.addEventListener('A press ended', buttonRelease);
    	controller.addEventListener('B press ended', buttonRelease);
    	controller.addEventListener('X press ended', buttonRelease);
    	controller.addEventListener('Y press ended', buttonRelease);


    	//initiate disposal when needed
    	controller.addEventListener('disconnected', function(event){
    	    This.__controlledDisconnected(controller);
    	});
    }
    __controlledDisconnected(controller){
        var controllerID = controller==this.controller1? 1:2;

        this.state["controller"+controllerID+"Connected"] = false;
        for(var i=0; i<this.listeners.controllerConnected.length; i++){
		    this.listeners.controllerConnected[i].call(this, false, controllerID);
		}

		//controller disposal
		controller.parent.remove(controller);
    }

    //enter this VR site in general
    enterVR(){
        if(this.hasVRSupport()){
            if(this.hmd){
                if(!this.hmd.isPresenting){
                    this.hmd.requestPresent([{source: this.renderer.domElement}]);
                    if(!this.visualisation){
                        this.setVisualisation(this.selectedVisualisation);
                    }
                }else
                    console.warn("already in VR");
            }else
                console.warn("no HMD connected");
        }
    }
    leaveVR(){
        if(this.hasVRSupport()){
            if(this.hmd){
                if(this.hmd.isPresenting){
                    this.selectedVisualisation = this.visualisation;
                    this.setVisualisation(null);
                    this.hmd.exitPresent();
                }else
                    console.warn("not yet in VR");
            }else
                console.warn("no HMD connected");
        }
    }
    isInVR(){
        return this.state.connected;
    }
    __update(){
        if(this.hasVRSupport()){
            //transform world
            if(this.visualisation){
                this.__updateTransform();
                this.visualisation.__interpolate(); //improves fps
            }

            //update position and such of controller
            THREE.VRController.update();

            // console.info(Date.now()-this.last);
            // this.last = Date.now();

            if(this.visualisation){
                if(this.controller1){
                    //calculate controller pos relative to scene
                    var pos = this.__getControllerPosRelativeToScene(this.controller1);

                    //pass data to visualisation
                    this.visualisation.__setHand(
                        "hand1",
                        pos,
                        this.controller1.userData.pressedButtons.primary
                    );
                }
                if(this.controller2){
                    //calculate controller pos relative to scene
                    var pos = this.__getControllerPosRelativeToScene(this.controller2);

                    //pass data to visualisation
                    this.visualisation.__setHand(
                        "hand2",
                        pos,
                        this.controller2.userData.pressedButtons.primary
                    );
                }
            }

            //update controllers (ray tracing)
            var controllers = [];
            if(this.controller1) controllers.push(this.controller1);
            if(this.controller2) controllers.push(this.controller2);

            for(var i=0; i<controllers.length; i++){
                var controller = controllers[i];
                if(!controller.userData.anchor){ //don't do world interaction if transforming
                    var line = controller.userData.line;
                    var pointer = controller.userData.pointer;
                    var colors = controller.userData.colors;

                    tempMatrix.identity().extractRotation(controller.matrixWorld);
                    this.rayCaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
                    this.rayCaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

                    var intersects = this.rayCaster.intersectObjects(this.rayCastGroup.children, true);
                    if(intersects.length>0){
                        var intersection = intersects[0];
                        var object = intersection.object;
                        this.__setHover(controller, object);

                        //update pointer appearance
                        line.scale.z = intersection.distance;
                        pointer.position.z = -intersection.distance;
                    }else{
                        this.__setHover(controller, null);

                        //update pointer appearance
                        line.scale.z = this.defaultPointerDist;
                        pointer.position.z = -this.defaultPointerDist;
                    }
                }
            }

            //rescale world based on controller input
            if(this.controller1 && this.controller1.userData.anchor &&
                this.controller2 && this.controller2.userData.anchor){ //2 handed
                var old1 = this.controller1.userData.anchor;
                var new1 = this.__getWorldPosition(this.controller1.userData.pointer);
                var old2 = this.controller2.userData.anchor;
                var new2 = this.__getWorldPosition(this.controller2.userData.pointer);

                var oldGrip = new Vec(old1).sub(old2).setY(0);
                var newGrip = new Vec(new1).sub(new2).setY(0);
                var offset = new Vec(this.transform.loc).sub(old1);

                var scale = newGrip.getLength()/oldGrip.getLength();
                var angle = newGrip.getYaw()-oldGrip.getYaw();
                var loc = new Vec(offset).mul(scale).addYaw(angle).sub(offset);
                var movement = new Vec(new1).sub(old1).mul(1, 0.5, 1).add(0, (new2.getY()-old2.getY())/2, 0);
                loc.add(movement);

                this.transformOffset.scale = scale;
                this.transformOffset.rot.setY(angle);
                this.transformOffset.loc.set(loc);

                this.__updateTransform();
            }else if(this.controller1 && this.controller1.userData.anchor){ //1 handed
                var vec = this.__getWorldPosition(this.controller1.userData.pointer)
                            .sub(this.controller1.userData.anchor);
                this.transformOffset.loc.set(vec);

                this.__updateTransform();
            }else if(this.controller2 && this.controller2.userData.anchor){ //1 handed
                var vec = this.__getWorldPosition(this.controller2.userData.pointer)
                            .sub(this.controller2.userData.anchor);
                this.transformOffset.loc.set(vec);

                this.__updateTransform();
            }


            //rendering
            this.renderer.render(this.scene, this.camera);
        }
    }
    __applyTransformOffset(){
        this.transform.scale *= this.transformOffset.scale;
        this.transform.loc.add(this.transformOffset.loc);
        this.transform.rot.add(this.transformOffset.rot);

        this.transformOffset.scale = 1;
        this.transformOffset.loc.set(0, 0, 0);
        this.transformOffset.rot.set(0, 0, 0);

        if(this.controller1 && this.controller1.userData.anchor){
            this.controller1.userData.anchor = this.__getWorldPosition(this.controller1.userData.pointer);
        }
        if(this.controller2 && this.controller2.userData.anchor){
            this.controller2.userData.anchor = this.__getWorldPosition(this.controller2.userData.pointer);
        }
    }
    __updateTransform(){
        var p = this.visualisation.VRproperties;
        var scene = this.visualisation.__getScene();
        scene.scale.set(
            p.scale * this.transform.scale * this.transformOffset.scale,
            p.scale * this.transform.scale * this.transformOffset.scale,
            p.scale * this.transform.scale * this.transformOffset.scale
        );
        scene.position.set(
            p.offset.getX() + this.transform.loc.getX() + this.transformOffset.loc.getX(),
            p.offset.getY() + this.transform.loc.getY() + this.transformOffset.loc.getY(),
            p.offset.getZ() + this.transform.loc.getZ() + this.transformOffset.loc.getZ()
        );
        scene.rotation.set(
            this.transform.rot.getX() + this.transformOffset.rot.getX(),
            this.transform.rot.getY() + this.transformOffset.rot.getY(),
            this.transform.rot.getZ() + this.transformOffset.rot.getZ()
        );
    }

    //manage controller interactions
    __setHover(controller, object){
        if(controller.userData.hover!=object){
           var oldHover = controller.userData.hover;
           if(oldHover){ //fire off hover events
               var shape = oldHover.userData.shape;
               //currently there is nothing to dispose, but maybe in the future
           }

           controller.userData.hover = object;
           var newHover = object;
           if(newHover){ //fire on hover events
               var shape = newHover.userData.shape;

               //forward hover to the visualisation system
               if(this.visualisation)
                    this.visualisation.__dispatchHoverEvent(shape, "hand"+controller.userData.id);
           }else{
               if(this.visualisation)
                    this.visualisation.__dispatchHoverEvent(null, "hand"+controller.userData.id);
           }

           this.__updateControllerStyle(controller);
        }
    }
    __setButtonPressed(controller, button){
        controller.userData.pressedButtons[button] = true;
        this.__updateControllerStyle(controller);


        if(button=="rescale"){
            this.__applyTransformOffset();
            controller.userData.anchor = this.__getWorldPosition(controller.userData.pointer);
        }
    }
    __setButtonReleased(controller, button){
        controller.userData.pressedButtons[button] = false;
        this.__updateControllerStyle(controller);

        if(button=="rescale"){
            controller.userData.anchor = null;
            this.__applyTransformOffset();
        }
    }
    __updateControllerStyle(controller){
        var lineC = controller.userData.colors.line.normal;
        var pointerC = controller.userData.colors.pointer.normal;
        if(controller.userData.pressedButtons.primary){
            lineC = controller.userData.colors.line.press;
            pointerC = controller.userData.colors.pointer.press;
        }else if(controller.userData.hover){
            lineC = controller.userData.colors.line.hover;
            pointerC = controller.userData.colors.pointer.hover;
        }

        controller.userData.line.material.color.setHex(lineC);
        controller.userData.pointer.material.color.setHex(pointerC);
    }
    __getControllerPosRelativeToScene(controller){
        controller.getWorldPosition(vec3);
        var rel = new Vec(vec3);
        var scene = this.visualisation.__getScene();
        scene.getWorldPosition(vec3);
        rel.sub(vec3).div(scene.scale.x).rotate(new Vec(-scene.rotation.x, -scene.rotation.y, -scene.rotation.z));
        return rel;
    }
    __getWorldPosition(object){
        object.getWorldPosition(vec3);
        return new Vec(vec3);
    }
    __getScenePosition(object){
        object.getWorldPosition(vec3);
        var rel = new Vec(vec3);
        this.visualisationS.__getScene().getWorldPosition(vec3);
        rel.sub(vec3).div(this.visualisationScene.scale.x);
        return rel;
    }

    //set visualisation
    setVisualisation(visualisation){
        if(this.hasVRSupport()){
            //dispose the old visualisation
            if(this.visualisation){
                var scene = this.visualisation.__getScene();
                this.visualisationScene.remove(scene);

                this.visualisation.__disableVR();
            }

            //set the new visualisation
            if(this.hmd && this.hmd.isPresenting){
                this.visualisation = visualisation;
                if(this.visualisation){
                    var scene = this.visualisation.__getScene();
                    this.visualisationScene.add(scene);

                    this.visualisation.__enableVR();
                }
            }else{
                this.selectedVisualisation = visualisation;
            }
        }
    }
})();
