Class("World", {

	World : function(){

		this.platform = new Platform();

		this.wood = new Mesh(woodGeom, woodMaterial);
		this.wood.mesh.rotation.y = Math.PI/2 * 3;

		this.wood.mesh.scale.set(50.5, 50, 50.5);
		this.wood.mesh.position.set(195, -50, -15);

		//Creating white background
		var material = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			side : THREE.BackSide
		});
		var sphereGeometry = new THREE.SphereGeometry(1000, 48, 48);
		this.background = new Mesh(sphereGeometry, material);

		this.light = new AmbientLight(0xffffff);
	}
});