Class("World", {

	World : function(){

		this.platform = new Platform();
		/*
		this.wood = new Mesh(woodGeom, woodMaterial);
		this.wood.mesh.rotation.y = Math.PI/2 * 3;

		this.wood.mesh.scale.set(50.5, 50, 50.5);
		this.wood.mesh.position.set(195, -50, -15);
		*/
		//decorating scene
		var tableTexture = new THREE.ImageUtils.loadTexture( "img/planks_birch.png" );
		tableTexture.wrapS = tableTexture.wrapT = THREE.RepeatWrapping;
		tableTexture.repeat.set( 20, 5 );
		this.table = new Mesh(new THREE.BoxGeometry(1850, 40, 500), new THREE.MeshBasicMaterial({map : tableTexture}));
		this.table.mesh.position.set(0, -50, 0);

		//creating table leg
		var legTexture = new THREE.ImageUtils.loadTexture( "img/log_acacia.png");
		legTexture.wrapS = legTexture.wrapT = THREE.RepeatWrapping;
		legTexture.repeat.set( 5, 5 );
		this.leg = new Mesh(new THREE.CylinderGeometry(30, 30, 700, 10), new THREE.MeshBasicMaterial({map : legTexture}));
		this.leg.mesh.position.set(900,-400, 220)


		//Creating white background
		var material = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			side : THREE.BackSide
		});
		var sphereGeometry = new THREE.SphereGeometry(3000, 48, 48);
		this.background = new Mesh(sphereGeometry, material);

		this.light = new AmbientLight(0xffffff);
	}
});