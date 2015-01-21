Game.script("wormHead", {

	start : function() {
		this.mesh._name = "head";

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

		//var self = this;
		this.sound = new Sound("step", {mesh : this.mesh});
		var a = function() {
			var position = world.worm.getPosition(), 
				block = world.worm._head;
			world.worm.moveTo(block, position);
			if (!Game.over) {
				setTimeout(a, Game.wormStep);//(world.worm.STEP/Game.level/Game.difficulty)*5);
			}
		}
		a();

		//world.worm.collidables.push(world.worm.target.mesh);
	},

	update : function() {
		//checking for collisions
		if (world.worm.target) {
			for (i = 0; i < this.rays.length; i += 1) {
				// We reset the raycaster to this direction
				this.caster.set(this.mesh.position, this.rays[i]);
				// Test if we intersect with any obstacle mes
				var collisions = this.caster.intersectObject(world.worm.target.mesh);
				for (var j in collisions) {
					if (collisions[j].object._name == "collectable" && collisions[j].distance < this.distance) {
						world.worm.target.mesh.visible = false;
						world.worm.target.reference.changeColor();
						var position = world.worm.target.reference.mesh.position.clone();
						world.worm.addBlock(position);
						Game.notifyCollectable();
						world.platform.createRandomCollectable();
					}
				}
			}
		}

	},

	moveTo : function(position, callback) {
		//create tween for moving
		//callback to be called on end movement
		this.sound.start();

		var self = this;
		var current = {
			x : self.mesh.position.x,
			y : self.mesh.position.y,
			z : self.mesh.position.z
		};
		var t = new TWEEN.Tween(current).to({x : position.x, y : position.y, z: position.z}, 100);
		t.easing(TWEEN.Easing.Exponential.EaseIn);
		t.onUpdate(function() {
			////console.log("current " + current);
			self.mesh.position.x = current.x;
			self.mesh.position.y = current.y;
			self.mesh.position.z = current.z;
		});
		t.onComplete(function() {
			if (!_.isUndefined(callback)) {
				callback();
			}
		});
		t.start();
	}

});