Game.script("collectableScript", {

	start : function() {
		this.mesh._name = "collectable";
	},

	update : function(dt) {

		this.mesh.rotation.x += 0.05;
		this.mesh.rotation.y += 0.05;

	}
})