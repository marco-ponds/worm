Class("Platform", {

	Platform : function() {

		this.NUM_PANELS = 3;
		this.WIDTH = 10;
		this.DEPTH = 10;
		this.BLOCK_SIZES = {
			width : 20,
			height : 20,
			depth : 20
		};
		this.blocks = [];

		this.geometry = new THREE.BoxGeometry(this.BLOCK_SIZES.width, this.BLOCK_SIZES.height, this.BLOCK_SIZES.depth);
		this.materials = [
			new THREE.MeshLambertMaterial({
				map: textures.base
			}),
			new THREE.MeshLambertMaterial({
				map: textures.base
			}),
			new THREE.MeshLambertMaterial({
				map: textures.base
			}),
			new THREE.MeshLambertMaterial({
				map: textures.base
			}),
			new THREE.MeshLambertMaterial({
				map: textures.base
			}),
			new THREE.MeshLambertMaterial({
				map: textures.base
			})
		];
		//creating cover blocks
		var cover1 = new Mesh(this.geometry, new THREE.MeshFaceMaterial(this.materials));
		var cover2 = new Mesh(this.geometry, new THREE.MeshFaceMaterial(this.materials));
		cover1.mesh.position.set(0, 0, -20);
		cover2.mesh.position.set(200, 0, 180);

		//creating the actual platform
		this.createPlatform();

	},

	createRandomCollectable : function() {
		var index = parseInt(Math.random() * this.blocks.length),
			reference = this.blocks[index],
			geometry = new THREE.BoxGeometry(this.BLOCK_SIZES.width/2.5, this.BLOCK_SIZES.height/2.5, this.BLOCK_SIZES.depth/2.5),
			//geometry = new THREE.IcosahedronGeometry(this.BLOCK_SIZES.width/2.5);
			material = new THREE.MeshBasicMaterial({map : THREE.ImageUtils.loadTexture("img/collectable.png")}),
			cube = new Mesh(geometry, material);

		reference.changeColor("shadow_c");
		new Sound("newCollectable").start();

		switch(reference.face_index) {
			case 2 : {
				console.log(reference.mesh.position);
				cube.mesh.position.set(reference.mesh.position.x, 25, reference.mesh.position.z);
				break;
			}
			case 4 : {
				console.log(reference.mesh.position);
				cube.mesh.position.set(reference.mesh.position.x, reference.mesh.position.y, reference.mesh.position.z + 25);
				break;
			}
			case 1 : {
				console.log(reference.mesh.position);
				cube.mesh.position.set(reference.mesh.position.x - 25, reference.mesh.position.y, reference.mesh.position.z);
				break;
			}
			default : {
				break;
			}
		}
		cube.addScript("collectableScript", "platform");
		cube.reference = reference;
		world.worm.setNewTarget(cube);

		Game.collidedCollectable = undefined;

	},

	createRandomObstacle : function() {
		var index = parseInt(Math.random() * world.platform.blocks.length)
		var o = world.platform.blocks[index];
		o.changeColor("iron");
		//o.scale(true);
		with (o) {
			setTimeout(function(){
				scale(true);
			}, Game.wormStep);

			setTimeout(function() {
				scale(false);
			}, 10000);
		}
	},

	testObstacle : function() {
		var index = 0;
		var o = world.platform.blocks[index];
		o.mesh._name = "obstacle";
		o.scale(true);
		with (o) {
			setTimeout(function() {
				scale(false);
			}, 1500);
		}
	},

	createPlatform : function() {
		for (var i=0; i<this.NUM_PANELS; i++) {
			for (var w=0; w<this.WIDTH; w++) {
				for (var d=0; d<this.DEPTH; d++) {
					//var block = new Mesh(this.geometry, new THREE.MeshFaceMaterial(this.normalStateMaterials), {script : "blockScript", dir : "platform"});
					var position = {}, rotation = {}, face_index;
					switch(i) {
						case 0 : {
							//block.mesh.position.set(this.BLOCK_SIZES.width * w, 0, this.BLOCK_SIZES.depth * d);
							//block.face_index = 2;
							face_index = 2;
							position =  {
								x : this.BLOCK_SIZES.width * w,
								y : 0,
								z : this.BLOCK_SIZES.depth * d
							};
							rotation = {
								x : 0,
								y : -Math.PI/2,
								z : 0
							};
							break;
						}
						case 1 : {
							//block.mesh.position.set(this.BLOCK_SIZES.width * w, (this.BLOCK_SIZES.depth * d) + this.BLOCK_SIZES.width, -this.BLOCK_SIZES.width);
							//block.face_index = 4;
							face_index = 4;
							position =  {
								x : this.BLOCK_SIZES.width * w,
								y : (this.BLOCK_SIZES.depth * d) + this.BLOCK_SIZES.width,
								z : -this.BLOCK_SIZES.width
							};
							rotation = {
								x : 0,
								y : 0,
								z : -Math.PI/2
							};
							break;
						}
						case 2 : {
							//block.mesh.position.set(+this.BLOCK_SIZES.width * this.WIDTH, (this.BLOCK_SIZES.depth * d) + this.BLOCK_SIZES.width, this.BLOCK_SIZES.width * w);
							//block.face_index = 1;
							face_index = 1;
							position =  {
								x : +this.BLOCK_SIZES.width * this.WIDTH,
								y : (this.BLOCK_SIZES.depth * d) + this.BLOCK_SIZES.width,
								z : this.BLOCK_SIZES.width * w
							};
							rotation = {
								x : -Math.PI/2,
								y : 0,
								z : 0
							};
							break;
						}
						default : break;
					}
					var materials = [
						new THREE.MeshLambertMaterial({
							map: textures.base
						}),
						new THREE.MeshLambertMaterial({
							map: textures.base
						}),
						new THREE.MeshLambertMaterial({
							map: textures.base
						}),
						new THREE.MeshLambertMaterial({
							map: textures.base
						}),
						new THREE.MeshLambertMaterial({
							map: textures.base
						}),
						new THREE.MeshLambertMaterial({
							map: textures.base
						})
					];
					var k = (10-w)+"_"+(d+1)+".png";
					materials[face_index] = new THREE.MeshLambertMaterial({map : textures[k]});
					var block = new Mesh(this.geometry, new THREE.MeshFaceMaterial(materials), {script : "blockScript", dir : "platform"});
					block.face_index = face_index;
					block.key = k;
					block.image = "img/platform/"+(10-w)+"_"+(d+1)+".png"; //storing tile image reference
					block.mesh.position.set(position.x, position.y, position.z);
					block.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
					//block.mesh.material.materials[block.face_index] = new THREE.MeshLambertMaterial({map : textures[k]});


					this.blocks.push(block);
				}
			}
		}
	}
});