Game.script("blockScript", {

	start : function () {
		this.mesh._name = "block";

		this.rays = [
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(1, 0, -1),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(-1, 0, -1),
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(-1, 0, 1)
		];
		this.caster = new THREE.Raycaster();
		this.distance = 0.5;
	},

	update : function () {

	},

	changeColor : function(image) {
		var material = [];
		for (var i=0; i<6; i++) {
			if (i==this.face_index) {
				var texture = textures[this.key];
				material.push(new THREE.MeshLambertMaterial({
					map : image ? THREE.ImageUtils.loadTexture('img/'+image+'.png') : texture,
				}));
			}
			else {
				material.push(new THREE.MeshLambertMaterial({
					map : textures.base,
				}));
			}
		}
		this.mesh.material = new THREE.MeshFaceMaterial(material);
	},

	scale : function(flag) {
		var t;
		var scale = {
			x : 1,
			y : 1,
			z : 1
		};
		var self = this;
		if (flag) {
			this.mesh._name = "obstacle";
			//setting up mesh collision detection for scaling blocks
			self.collided = false;
			var a = function() {
				var v;
				switch(world.worm.platform) {
					case 1 : {
						v = new THREE.Vector3(self.mesh.position.x, self.mesh.position.y + 20, self.mesh.position.z);
						break;
					}
					case 2 : {
						v = new THREE.Vector3(self.mesh.position.x, self.mesh.position.y, self.mesh.position.z + 20);
						break;
					}
					case 3 : {
						v = new THREE.Vector3(self.mesh.position.x - 20, self.mesh.position.y, self.mesh.position.z);
						break;
					}
				}
				if (world.worm.head.mesh.position.equals(v)) {
					Game.handleCollision();
					self.collided = true;
				}
				if (!self.collided) {
					setTimeout(a, 20);
				}
			}
			a();
			//end of setting up mesh collision detection
			this.changeColor("iron");
			new Sound("obstacle").start();
			switch(this.face_index) {
				case 2 : {
					//this.mesh.scale.set(1, 10, 1);
					t = new TWEEN.Tween(scale).to({x : 1, y : (Game.level+1), z: 1}, 500);
					break;
				}
				case 4 : {
					//this.mesh.scale.set(1, 1, 10);
					t = new TWEEN.Tween(scale).to({x : 1, y : 1, z: (Game.level+1)}, 500);
					break;
				}
				case 1 : {
					t = new TWEEN.Tween(scale).to({x : (Game.level+1), y : 1, z: 1}, 500);
					break;
				}
			}
			t.easing(TWEEN.Easing.Elastic.EaseInOut);
			t.onUpdate(function() {
				self.mesh.scale.set(scale.x, scale.y, scale.z);
			});
			t.start();
		} else {
			this.mesh._name = "";
			var actualScale = {
				x : self.mesh.scale.x,
				y : self.mesh.scale.y,
				z : self.mesh.scale.z
			};
			t = new TWEEN.Tween(actualScale).to({x : 1, y : 1, z: 1}, 500);
			t.easing(TWEEN.Easing.Elastic.EaseInOut);
			t.onUpdate(function() {
				self.mesh.scale.set(actualScale.x, actualScale.y, actualScale.z);
			});
			t.onComplete(function() {
				self.collided = true; //to stop checking collisions.
				self.changeColor();
			});
			t.start();
			//this.changeColor("blue");
		}
	}
})