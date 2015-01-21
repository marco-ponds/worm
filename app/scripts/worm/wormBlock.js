Game.script("wormBlock", {

	start : function() {
		this.mesh._name = "body";

		self.collided = false;
		var a = function() {
			var v;
			v = new THREE.Vector3(self.mesh.position.x, self.mesh.position.y, self.mesh.position.z);
			if (world.worm.head.mesh.position.distanceTo(v) < 1) {
				Game.handleCollisionSelf();
				Game.collidedSelf = true;
			}
			if (!Game.collidedSelf) {
				setTimeout(a, 100);
			}
		}
		//a();
	},

	update : function() {

	},

	moveTo : function(position, callback) {
		//create tween for moving
		//callback to be called on end movement
		//element._position = position;
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