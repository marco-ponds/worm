Class("Worm", {

	Worm : function() {

		this.body = new BEE();
		this.head = this.createHead(); //mesh
		this.collidables = [];
		this.head.addScript("wormHead", "worm");

		this.init();
	},

	init : function() {
		this.head.mesh.position.set(0, 20, 0);
		this.head.mesh.rotation.set(0, 0, 0);

		this.quaternion = new THREE.Quaternion();
		this.xAxis = new THREE.Vector3(1, 0, 0);
		this.yAxis = new THREE.Vector3(0, 1, 0);
		this.zAxis = new THREE.Vector3(0, 0, 1);

		this._head = this.body.createNode(this.head); //root
		this.latestBlock = this._head;

		this.platform = 1; //1: lower, 2: left, 3: right
		this.stopped = false;
		this.target = undefined;

		this.STEP = 200;
		this.moveStep = 0;
		this.singleStep = 20;
		this.increment = {
			x : 20,
			y : 0,
			z : 0
		};
		this.head._oldPosition = {
			x : 0,
			y : 20,
			z : 0
		};
		this.direction = "u";
		this.rotationAxis = "y";
		this.leftAngle = ((Math.PI/2));
		this.rightAngle = (-(Math.PI)/2);
	},

	setNewTarget : function(target) {
		this.target = target; 
	},

	getNewDirection : function( dir ) {
		var newdir = "";
		switch(this.direction) {
			case "u" : {
				newdir = (dir == "left") ? "l" : "r";
				break;
			}
			case "d" : {
				newdir = (dir == "left") ? "r" : "l";
				break;
			}
			case "r" : {
				newdir = (dir == "left") ? "u" : "d";
				break;
			}
			case "l" : {
				newdir = (dir == "left") ? "d" : "u";
				break;
			}
		}
		return newdir;
	},

	rotate : function(axis, angle) {
		this.quaternion.setFromAxisAngle(axis, angle);
		this.head.mesh.quaternion.multiply(this.quaternion);
	},

	getPosition : function() {
		//calcola la posizione in cui andare a seconda della direzione
		var next_pos = {
			x : (this.head._oldPosition.x + this.increment.x),
			y : (this.head._oldPosition.y + this.increment.y),
			z : (this.head._oldPosition.z + this.increment.z)
		};
		switch (this.platform) {
			case 1 : {
				//check if we didn't go outside the platform
				if ((next_pos.x < 0) || (next_pos.z > 180)) {
					Game.wentOutside();
				}
				//check if we didn't go too far
				else if (next_pos.x > 180) {
					this.platform = 3;
					this.head.mesh.rotation.x = 0;
					this.head.mesh.rotation.y = 0;
					this.head.mesh.rotation.z = (Math.PI/2);//+= (Math.PI/2);
					//world.worm.rotate(world.worm.zAxis, Math.PI/2); //TEST
					this.rotationAxis = "x"; //TEST
					this.leftAngle = (-(Math.PI/2)); //OK
					this.rightAngle = ((Math.PI)/2); //OK
					this.direction = "u";
					//sono a destra, aggiusto la direzione
					this.increment = {
						x : 0,
						y : 20,
						z : 0
					};
					next_pos = {
						x : 180,
						y : (this.head._oldPosition.y + this.increment.y),
						z : (this.head._oldPosition.z + this.increment.z)
					};
				} else if (next_pos.z < 0) {
					this.platform = 2;
					this.head.mesh.rotation.y = (Math.PI/2);
					this.head.mesh.rotation.z = 0;
					this.head.mesh.rotation.x = (Math.PI/2);//+= (Math.PI/2); //OK
					//world.worm.rotate(world.worm.xAxis, -(Math.PI/2)); //TEST
					this.direction = "u";
					this.rotationAxis = "y"; //OK
					this.leftAngle = ((Math.PI/2)); //OK
					this.rightAngle = -((Math.PI)/2);
					this.increment = {
						x : 0,
						y : 20,
						z : 0
					};
					next_pos = {
						x : (this.head._oldPosition.x + this.increment.x),
						y : (this.head._oldPosition.y + this.increment.y),
						z : 0
					};
				}
			}
			case 2 : {
				if ((next_pos.x < 0) || (next_pos.y > 200)) {
					Game.wentOutside();
				}
				else if (next_pos.y < 20) {
					this.platform = 1;
					this.head.mesh.rotation.x = 0;//-= (Math.PI/2);
					this.direction = "r";
					this.rotationAxis = "y"; //OK
					this.leftAngle = ((Math.PI/2)); //OK
					this.rightAngle = -((Math.PI)/2); //OK
					this.increment = {
						x : 0,
						y : 0,
						z : 20
					};
					next_pos = {
						x : (this.head._oldPosition.x + this.increment.x),
						y : 20,
						z : (this.head._oldPosition.z + this.increment.z)
					};
				} else if (next_pos.x > 180) {
					this.platform = 3;
					this.direction = "r";
					this.head.mesh.rotation.z += (Math.PI/2);
					this.rotationAxis = "x"; //OK
					this.leftAngle = -((Math.PI/2)); //OK
					this.rightAngle = ((Math.PI)/2); //OK
					this.increment = {
						x : 0,
						y : 0,
						z : 20
					};
					next_pos = {
						x : 180,
						y : (this.head._oldPosition.y + this.increment.y),
						z : (this.head._oldPosition.z + this.increment.z)
					};
				}
			}
			case 3 : {
				if ((next_pos.z > 180) || (next_pos.y > 200)) {
					Game.wentOutside();
				}
				else if (next_pos.y < 20) {
					this.platform = 1;
					this.direction = "d";
					this.head.mesh.rotation.x = 0;
					this.head.mesh.rotation.y = (Math.PI);
					this.head.mesh.rotation.z = 0;//+=(Math.PI);
					//world.worm.rotate(world.worm.zAxis, (Math.PI/2))
					this.rotationAxis = "y";
					this.leftAngle = ((Math.PI/2));
					this.rightAngle = -((Math.PI)/2);
					this.increment = {
						x : -20,
						y : 0,
						z : 0
					};
					next_pos = {
						x : (this.head._oldPosition.x + this.increment.x),
						y : 20,
						z : (this.head._oldPosition.z + this.increment.z)
					};
				} else if (next_pos.z < 0) {
					this.platform = 2;
					this.direction = "l";
					//this.head.mesh.rotation.y -= (Math.PI/2);
					this.head.mesh.rotation.x = (Math.PI/2);
					this.head.mesh.rotation.y = (Math.PI);
					this.head.mesh.rotation.z = 0;
					this.rotationAxis = "y";
					this.leftAngle = ((Math.PI/2));
					this.rightAngle = -((Math.PI)/2);
					this.increment = {
						x : -20,
						y : 0,
						z : 0
					};
					next_pos = {
						x : (this.head._oldPosition.x + this.increment.x),
						y : (this.head._oldPosition.y + this.increment.y),
						z : 0
					};
				}
			}
		}
		Game.addPoints(2);
		return next_pos;
	},

	changeDirection : function(key) {
		var obj = {x : 0, y : 0, z : 0};
		if (key == "left") {
			//bisogna andare a sinistra
			switch (this.platform) {
				case 1 : {
					switch (this.direction) {
						case "u" : {obj = {x : (this.increment.x - 20), y : 0, z : (this.increment.z - 20)}; break;}
						case "d" : {obj = {x : (this.increment.x + 20), y : 0, z : (this.increment.z + 20)}; break;}
						case "l" : {obj = {x : (this.increment.x - 20), y : 0, z : (this.increment.z + 20)}; break;}
						case "r" : {obj = {x : (this.increment.x + 20), y : 0, z : (this.increment.z - 20)}; break;}
					}
					break;
				}
				case 2 : {
					switch (this.direction) {
						case "u" : {obj = {x : (this.increment.x - 20), y : (this.increment.y - 20), z : 0}; break;}
						case "d" : {obj = {x : (this.increment.x + 20), y : (this.increment.y + 20), z : 0}; break;}
						case "l" : {obj = {x : (this.increment.x + 20), y : (this.increment.y - 20), z : 0}; break;}
						case "r" : {obj = {x : (this.increment.x - 20), y : (this.increment.y + 20), z : 0}; break;}
					}
					break;
				}
				case 3 : {
					switch (this.direction) {
						case "u" : {obj = {x : 0, y : (this.increment.y - 20), z : (this.increment.z - 20)}; break;}
						case "d" : {obj = {x : 0, y : (this.increment.y + 20), z : (this.increment.z + 20)}; break;}
						case "l" : {obj = {x : 0, y : (this.increment.y - 20), z : (this.increment.z + 20)}; break;}
						case "r" : {obj = {x : 0, y : (this.increment.y + 20), z : (this.increment.z - 20)}; break;}
					}
					break;
				}
			}
			this.head.mesh.rotation[this.rotationAxis] += this.leftAngle;
		} else {
			//bisogna andare verso destra
			switch (this.platform) {
				case 1 : {
					switch (this.direction) {
						case "u" : {obj = {x : (this.increment.x - 20), y : 0, z : (this.increment.z + 20)}; break;}
						case "d" : {obj = {x : (this.increment.x + 20), y : 0, z : (this.increment.z - 20)}; break;}
						case "l" : {obj = {x : (this.increment.x + 20), y : 0, z : (this.increment.z + 20)}; break;}
						case "r" : {obj = {x : (this.increment.x - 20), y : 0, z : (this.increment.z - 20)}; break;}
					}
					break;
				}
				case 2 : {
					switch (this.direction) {
						case "u" : {obj = {x : (this.increment.x + 20), y : (this.increment.y - 20), z : 0}; break;}
						case "d" : {obj = {x : (this.increment.x - 20), y : (this.increment.y + 20), z : 0}; break;}
						case "l" : {obj = {x : (this.increment.x + 20), y : (this.increment.y + 20), z : 0}; break;}
						case "r" : {obj = {x : (this.increment.x - 20), y : (this.increment.y - 20), z : 0}; break;}
					}
					break;
				}
				case 3 : {
					switch (this.direction) {
						case "u" : {obj = {x : 0, y : (this.increment.y - 20), z : (this.increment.z + 20)}; break;}
						case "d" : {obj = {x : 0, y : (this.increment.y + 20), z : (this.increment.z - 20)}; break;}
						case "l" : {obj = {x : 0, y : (this.increment.y + 20), z : (this.increment.z + 20)}; break;}
						case "r" : {obj = {x : 0, y : (this.increment.y - 20), z : (this.increment.z - 20)}; break;}
					}
					break;
				}
			}
			this.head.mesh.rotation[this.rotationAxis] += this.rightAngle;
		}
		this.increment = obj;
		this.direction = this.getNewDirection(key);
	},

	moveTo : function(block, position) {

		//muovo il blocco, poi
		var self = this;
		window.test = block;
		block.data.moveTo(position, function() {
			if (block.leftBranch) {
				self.moveTo(block.leftBranch, block.data._oldPosition);
			}
			block.data._oldPosition = position;
		});

	},

	createBlock : function(h, w, d) {

		var _h = h ? h : 12, 
			_w = w ? w : 12,
			_d = d ? w : 12

		var geometry = new THREE.BoxGeometry(_h, _w, _d),
			material = new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture("img/body.png")}),
			cube = new Mesh(geometry, material);
		return cube;

	},

	createHead : function() {

		var geometry = new THREE.BoxGeometry(15, 15, 15),
			materials = [
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_front.png') //nope davanti
				}),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope dietro
				}),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope sopra
				}),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope sotto
				}),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_right.png') //right
				}),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture('img/worm_left.png') //left
				})
			],
			cube = new Mesh(geometry, new THREE.MeshFaceMaterial(materials));
		return cube;

	},

	die : function() {
		var materials = [
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_front_dead.png') //nope davanti
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head_dead.png') //nope dietro
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head_dead.png') //nope sopra
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head_dead.png') //nope sotto
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_right_dead.png') //right
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_left_dead.png') //left
			})
		];
		world.worm.head.mesh.material = new THREE.MeshFaceMaterial(materials);
		try {
			var path = world.worm.body.getPath(world.worm.body.getAllLeaves()[0]);
			for (var i=1; i<path.length; i++) {
				path[i].n.data.mesh.material.map = THREE.ImageUtils.loadTexture("img/body_dead.png");
			}
		} catch(e) {}
	},

	resurrect : function() {
		var materials = [
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_front.png') //nope davanti
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope dietro
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope sopra
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_head.png') //nope sotto
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_right.png') //right
			}),
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture('img/worm_left.png') //left
			})
		];
		world.worm.head.mesh.material = new THREE.MeshFaceMaterial(materials);
		try {
			var path = world.worm.body.getPath(world.worm.body.getAllLeaves()[0]);
			for (var i=1; i<path.length; i++) {
				path[i].n.data.mesh.material.map = THREE.ImageUtils.loadTexture("img/body.png");
			}
		} catch(e) {}
	},

	addBlock : function(position) {
		console.log("calling addBlock");
		var block = this.createBlock(18, 18, 18);
		//block.addScript("wormBlock", "worm"); //mesh
		block.moveTo = function(position, callback) {
			//create tween for moving
			//callback to be called on end movement
			//element._position = position;
			var self = this;
			var current = {
				x : self.mesh.position.x,
				y : self.mesh.position.y,
				z : self.mesh.position.z
			};
			var vec3 = new THREE.Vector3(current.x, current.y, current.z);
			if (world.worm.head.mesh.position.equals(vec3)) {
				Game.handleSelfCollision();
			}
			var t = new TWEEN.Tween(current).to({x : position.x, y : position.y, z: position.z}, 100);
			t.easing(TWEEN.Easing.Exponential.EaseIn);
			t.onUpdate(function() {
				////console.log("current " + current);
				self.mesh.position.x = current.x;
				self.mesh.position.y = current.y;
				self.mesh.position.z = current.z;

				var vec3 = new THREE.Vector3(current.x, current.y, current.z);
				if (world.worm.head.mesh.position.equals(vec3)) {
					Game.handleSelfCollision();
				}
			});
			t.onComplete(function() {
				if (!_.isUndefined(callback)) {
					callback();
				}
			});
			t.start();
		};
		var _block = this.body.createNode(block); //leaf
		this.latestBlock.addLeaf(_block, {branch : "left"});
		this.latestBlock = _block;

		this.collidables.push(block.mesh);

		block.mesh.position.set(position.x, position.y, position.z);
	}

});