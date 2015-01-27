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

		//creating floor
		var floorTexture = new THREE.ImageUtils.loadTexture( "img/stonebrick_carved.png" );
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set( 40, 40 );
		this.floor = new Mesh(new THREE.BoxGeometry(5000, 40, 5000), new THREE.MeshBasicMaterial({map : floorTexture}));
		this.floor.mesh.position.set(0, -500, 0);

		//creating bookshelf
		var bookshelfTexture = new THREE.ImageUtils.loadTexture( "img/bookshelf.png" );
		bookshelfTexture.wrapS = bookshelfTexture.wrapT = THREE.RepeatWrapping;
		bookshelfTexture.repeat.set( 5, 5 );
		this.bookshelf = new Mesh(new THREE.BoxGeometry(50, 1000, 1000), new THREE.MeshBasicMaterial({map : bookshelfTexture}));
		this.bookshelf.mesh.position.set(1000, -50, 0);

		//creating wall
		var wallTexture = new THREE.ImageUtils.loadTexture( "img/stonebrick_carved.png" );
		wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.repeat.set( 8, 8 );
		this.wall = new Mesh(new THREE.BoxGeometry(2000, 2000, 100), new THREE.MeshBasicMaterial({map : wallTexture}));
		this.wall.mesh.position.set(0, -500, -550);

		//creating a candle
		var whiteTexture = new THREE.ImageUtils.loadTexture( "img/whiteTexture.png" );
		whiteTexture.wrapS = whiteTexture.wrapT = THREE.RepeatWrapping;
		whiteTexture.repeat.set( 2, 2 );
		this.plate = new Mesh(new THREE.CylinderGeometry(50, 50, 5, 10), new THREE.MeshBasicMaterial({map : whiteTexture}));
		this.plate.mesh.position.set(500, 0, 150)

		var candleTexture = new THREE.ImageUtils.loadTexture( "img/candleTexture.png" );
		candleTexture.wrapS = candleTexture.wrapT = THREE.RepeatWrapping;
		candleTexture.repeat.set( 2, 2 );
		this.candle = new Mesh(new THREE.CylinderGeometry(20, 20, 100, 10), new THREE.MeshBasicMaterial({map : candleTexture}));
		this.candle.mesh.position.set(500, 40, 150);

		var stoppino = new Mesh(new THREE.CylinderGeometry(2, 2, 10, 10), new THREE.MeshBasicMaterial({color : 0x000000}));
		stoppino.mesh.position.set(500, 90, 150);

		//candle fire
		this.fire = new ParticleEngine();
		this.fire.setValues(ParticleEngineModels.candle);
		this.fire.initialize();
		this.fire.particleMesh.position.set(500, 95, 150);
		this.fire.particleMesh.scale.set(0.6,0.6,0.6);

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