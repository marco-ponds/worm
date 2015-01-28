/********************************************************************************
	MAIN SCRIPT
	copyright© 2014 Marco Stagni. http://marcostagni.com
********************************************************************************/


include("app/worm");
include("app/platform");
include("app/world");

var mouseX = 0, mouseY = 0, zoom = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var CAMERA_MAX_Z = 1000, CAMERA_MIN_Z = 50;

var worm, world, platform;

var woodGeom, woodMaterial;

var textures = {};

var messages = ["Loading..", "Initializing awesomeness.", "Optimizing Universe.", "Creating pixels..", "Hey mum! No hands!", "#yolo", "Thanks Mr.Doob, I <3 you.", "Waiting for the answer to Life, the Universe and everything.."];
var messagesInterval, finishedLoading = false;

function onCreate() {

	core.scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0005);//0xefd1b5, 0.001 );

	Game.level = 1;
	Game.difficulty = 1;
	Game.points = 0;
	Game.lives = 3;
	Game.over = false;
	Game.wormStep = 1200;

	Game.collidedCollectable = false;
	Game.collidedSelf = false;

	AudioEngine.DELAY_FACTOR = 100;
	AudioEngine.volume.gain.value = 10; //TEMP

	world = new World();
	//world.platform.createRandomCollectable();
	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	//document.addEventListener( 'mousewheel', onDocumentMouseWheel, false);

	core.camera.object.position.set(-200, 200, 380);
	core.camera.object.lookAt(new THREE.Vector3(180, 20, 0));

	core.camera.addScript("cameraScript", "camera");

	new Sound("intro").start();
	$('#whiteElement').animate({"opacity" : "0.5"}, 2000, function() {
		$('.guiElement').css("display", "block");
	});

}

Game.update = function() {
	try {
		world.fire.update(core.clock.getDelta() * 0.5);
	}
	catch(e){}
}

Game.restart = function() {
	//clean everything
	world.platform.removeRandomCollectable();
	try {
		var path = world.worm.body.getPath(world.worm.body.getAllLeaves()[0]);
		for (var i=1; i<path.length; i++) {
			core.remove(path[i].n.data.mesh);
		}
	} catch (e) {}
	finally {
		core.remove(world.worm.head.mesh);
	}
	$('#gameover').animate({"opacity" : "0","z-index" : "-99"}, 500, function() {
		//starting game
		Game.level = 1;
		Game.difficulty = 1;
		Game.points = 0;
		Game.lives = 3;
		Game.over = false;
		Game.wormStep = 1200;

		Game.collidedCollectable = false;
		Game.collidedSelf = false;
		Game.start();
	});
}

Game.start = function() {
	$("#whiteElement").fadeOut();
	$("#start").fadeOut();
	world.worm = new Worm();
	world.platform.createRandomCollectable();
	var a = function() {
		var time = (Math.random() * Game.wormStep) + 1000;
		world.platform.createRandomObstacle();
		if (!Game.over) {
			setTimeout(a, time);
		}
	}
	a();

}

Game.wentOutside = function() {
	DieWormDie();
}

Game.handleCollision = function() {
	Game.lives -= 1;
	if (Game.lives == 0) {
		DieWormDie();
	} else {
		new Sound("error").start();
		world.worm.die();
		setTimeout(function() {
			world.worm.resurrect();
		}, 1500)
	}
}

Game.handleSelfCollision = function() {
	DieWormDie();
}

Game.notifyCollectable = function() {
	Game.addPoints(10);
}

Game.addPoints = function(points) {
	Game.points += points;
	//changing game level
	if ((0 < Game.points) && (Game.points < 100)) {
		Game.level = 1;
		Game.wormStep = 1200;
	}
	else if ((100 < Game.points) && (Game.points < 250)) {
		Game.level = 2;
		Game.wormStep = 1000;
	}
	else if ((250 < Game.points) && (Game.points < 600)) {
		Game.level = 3;
		Game.wormStep = 900;
	}
	else if ((600 < Game.points) && (Game.points < 1000)) {
		Game.level = 4;
		Game.wormStep = 800;
	}
	else if ((1000 < Game.points) && (Game.points < 1400)) {
		Game.level = 5;
		Game.wormStep = 750;
	}
	else if ((1400 < Game.points) && (Game.points < 2000)) {
		Game.level = 6;
		Game.wormStep = 630;
	}
	else if ((2000 < Game.points) && (Game.points < 2700)) {
		Game.level = 7;
		Game.wormStep = 560;
	}
	else if ((2700 < Game.points) && (Game.points < 3400)) {
		Game.level = 8;
		Game.wormStep = 480;
	}
	else if ((3400 < Game.points) && (Game.points < 4000)) {
		Game.level = 9;
		Game.wormStep = 400;
	}
	else if ((4000 < Game.points) && (Game.points < 5000)) {
		Game.level = 10;
		Game.wormStep = 300;
	}
	updateGui();
}

function DieWormDie() {
	console.log("game over, man");
	Game.over = true;
	new Sound("gameover").start();
	world.worm.die();
	world.fire.repeat = false;
	$('#gameover').animate({"opacity" : "0.7","z-index" : "99"}, 500, function() {
		$('#score').text("Your score: " + Game.points);
	});
}

function updateGui() {
	$('#points').text("points: " + Game.points);
	$('#level').text("level: " + Game.level);
	$('#lives').text("lives: " + Game.lives);
}

function onDocumentMouseWheel (event) {
	event.preventDefault();
	zoom = event.wheelDelta * 0.05;
	core.camera.object.position.z += zoom;
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

/********************************************************************************
	progressAnimation()

	@params callback[function]
	@output null

	@desc called to perform custom progress animation when loading scene
	if not set, default progress animation will be used.
********************************************************************************/

progressAnimation = function(callback) {
	$('#loader').animate({"opacity" : "0"}, 1000 , function () {
		$('#loader').remove();
		$('body').animate({backgroundColor : "#fff"}, 200 , callback);
	});
}

/********************************************************************************
	preLoad()

	@params callback[function]
	@output null

	@desc called to perform custom progress animation when loading scene
	if not set, default progress animation will be used.
********************************************************************************/

preload = function(callback) {
	//use this method to perform heavy tasks
	//loading json models
	messagesInterval = function() {
		$("#loading").text(messages[parseInt(Math.random()*messages.length)]);
		if (!finishedLoading) {
			setTimeout(messagesInterval, Math.random() * 20000);
		}
	};
	messagesInterval();
	console.log("Inside preLoad method.");
	var loader = new THREE.JSONLoader();
	loader.load("WormWall.json", function(geometry, materials) {
		woodGeom = geometry;
		woodMaterial = materials;
		//woodMaterial.map.repeat.x = 20;
		//woodMaterial.map.repeat.y = 20;
		textures["base"] = THREE.ImageUtils.loadTexture("img/iron.png", {}, function() {
			saveTextures(0, 0, callback);
		});
	});
}

//this will be handled directly by wage in the next future
var imgCompleted = 0;

function saveTextures(i, j, callback) {
	var k = (i+1)+"_"+(j+1)+".png";
	textures[k] = THREE.ImageUtils.loadTexture("img/platform/"+k, {}, function() {
		imgCompleted++;
		j++;
		if (j == 10) {
			j = 0;
			i ++;
		}
		if (imgCompleted == 100) {
			callback();
		} else saveTextures(i,j, callback);
	});
}

/********************************************************************************
	displayMessage()

	@params message[string], type[string]
	@output null

	@desc display console messages. type can be "error", "warning", "info", or 
	null.
********************************************************************************/

function displayMessage(message, type) {
	switch(type) {
		case "error": {
			console.err(message);
		}

		case "warning": {
			console.warn(message)
		}

		case "info": {
			console.info(message)
		}

		default : {
			console.log(message);
		}

	}
}

/********************************************************************************
	input.keydown()

	@params event[object]
	@output null

	@desc fired when a key is pressed on keyboard.
********************************************************************************/

input.keydown = function(event) {

};

/********************************************************************************
	input.keyup()

	@params event[object]
	@output null

	@desc fired when a key is released on keyboard.
********************************************************************************/

input.keyup = function(event) {
	switch (event.keyCode) {
		case 37 : {
			world.worm.changeDirection("left");
			break;
		}
		case 39 : {
			world.worm.changeDirection("right");
			break;
		}
	}
};

/********************************************************************************
	HELPERS
	
	These methods will be inside a custom core class. This is just a temporary
	solution.
********************************************************************************/

function degToRad(angle) {
	return angle * (Math.PI / 180);
}

function getProportion(max1, b, max2) {
	return (max1 * b)/max2;
}
