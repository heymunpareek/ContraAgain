var contra, contraAnimation, contrashooting;
var infinitegroundImg, infground;
var shooterImg;
var bomb, bombGrp;
var blockImg;
var bullet, bulletGrp;
WIN = 2;
PLAY = 1; END=0; var gs = PLAY;

var scoreCounter = 0;
var jumpSound, dieSound, checkPoint, bgSound;

var allBlocks = [];
var allShooters = [];
var counterX, counterY;

var points = 0;
var edges;
var invisibleGround;
var bgImg;


function preload(){
  contraAnimation = loadAnimation("firstmov.png","secondmov.png", "thirdmov.png", "fourthmov.png", "fifthmov.png");
  contrashooting = loadAnimation("contrashooting.png");
  infinitegroundImg = loadImage("infiniteground.png");
  blockImg = loadImage("block.png");
  shooterImg = loadImage("shooter.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  bgSound = loadSound("bgSound.mp3");
  bgImg = loadImage("FINALBGIMG.png")
}

function setup() {
   createCanvas(windowWidth, windowHeight);

   contra = createSprite((50/2048)*windowWidth,(200/1000)*windowHeight,(10/2048)*windowWidth,(10/1000)*windowHeight);
   contra.addAnimation("shooting", contrashooting);
   contra.addAnimation("contra", contraAnimation);    
   contra.scale = 0.15;
   contra.velocityY = contra.velocityY + 0.8; //gravity
  
   infground = createSprite((500/2048)*windowWidth,(380/1000)*windowHeight,(100000/2048)*windowWidth,(100/1000)*windowHeight);
   infground.shapeColor = "#231709"
   invisibleGround = createSprite((500/2048)*windowWidth,(25/1000)*windowHeight,(100000/2048)*windowWidth,(100/1000)*windowHeight);
   invisibleGround.visible = false;
   spawnBlock();
   spawnShooter();

  

   
   
   
  //groups  
  
  bulletGrp = new Group();
  

  if(bgSound) {
    userStartAudio();
    bgSound.play();
  }
}

function draw() {
   background("black");
   image(bgImg, -1000, -1400, 10000 ,2048)
   
   
   
    if(gs === PLAY) {
      contra.collide(infground);      

    
    shoot();
    jump();
    movementLeftRight();
    gameCamera();
    
      
    for (var i = 0; i < 200; i++) {
      if(allBlocks[i].isTouching(contra)) {
        gs = END;
      }
      if(allBlocks[i].isTouching(bulletGrp)) {
        bulletGrp.destroyEach();
        allBlocks[i].destroy();
        points = points+100;
      }   
        
    }
    for(var i = 0; i < 100; i++) {
      allShooters[i].bounceOff(invisibleGround);
      allShooters[i].bounceOff(infground);
      if(bulletGrp.isTouching(allShooters[i])) {
        bulletGrp.destroyEach();
        allShooters[i].destroy();
        points = points + 300;
      }
      if(contra.isTouching(allShooters[i])) {
        gs = END;
      }
    }


    counterX = contra.x;
    counterY = contra.y;
    
    
    
     
    drawSprites();

    fill("white");
    textSize(30);
    text("Time: " +scoreCounter, displayWidth/2, (50/1000)*windowHeight);

    scoreCounter = Math.round((scoreCounter + getFrameRate()/60));
    text("Points: " + points, (200/2048)*width, (50/1000)*windowHeight);

    text("INSTRUCTIONS:", (-300/2048)*width, (50/1000)*windowHeight);
    text("LEFT: Move Left", (-300/2048)*width, (100/1000)*windowHeight);
    text("RIGHT: Move Right", (-300/2048)*width, (150/1000)*windowHeight);
    text("UP: JUMP", (-300/2048)*width, (200/1000)*windowHeight);
    text("X: Shoot Bullets", (-300/2048)*width, (250/1000)*windowHeight);

    if(counterX >= 5024) {      
      gs = WIN;
    }
    
    
}

  else if(gs === END) {
    contra.destroy();
    bulletGrp.destroyEach();
    infground.destroy();
  } 

  else if(gs === WIN) {
    contra.destroy();
    bulletGrp.destroyEach();
    infground.destroy();
    

  }
  
  
  if(scoreCounter % 100 ===0 && scoreCounter > 0) {
    checkPoint.play();
  }
 
   drawSprites();
  
  if(gs === END) {
    fill("white");
    textSize(50);
    text("GAME OVER", counterX, counterY -75);
    
    text("TRY, TRY BUT DON'T CRY!!", counterX - 300, counterY);
    text("CLICK ON REFRESH BUTTON NOW", counterX - 300, counterY + 75);
    text("YOUR TIME:" + scoreCounter, counterX - 300, counterY + 150);
    text("YOUR POINTS:" + points, counterX - 300, counterY + 150+75);
    
  }
  if(gs === WIN) {
    fill("white");
    textSize(50);
    text("YOU WIN!!", counterX, counterY -100);
    text("YOUR TIME:" + scoreCounter, counterX - 300, counterY + 150);
    text("YOUR POINTS:" + points, counterX - 300, counterY + 150+75);
    
  }
}

function spawnShooter() {
  for(var i = 0; i < 100000; i+=1000) {
    allShooters.push(createSprite(i+1000, (300/1000)*windowHeight));  
    

     
  }
  for(var i = 0; i < 100; i++) {
    allShooters[i].addImage(shooterImg);
    allShooters[i].scale = 0.5;
    allShooters[i].velocityY = Math.round(random(1,10));
    
    
  }
  
}


function shoot() {
  if(keyWentDown("x")) {
    contra.changeAnimation("shooting", contrashooting);
    bullet = createSprite(contra.x+23,contra.y-3,7,2);
    bullet.shapeColor = "blue";
    bullet.velocityX = 20;
    
    bullet.lifetime = 20;
    bulletGrp.add(bullet);
  }
  
}

function jump() {
  if(keyDown("up") && contra.y > ((290/1000)*windowHeight)) {
    contra.velocityY = contra.velocityY -12;
  }
  else
  contra.velocityY = contra.velocityY + 0.8;

}

function movementLeftRight() {
  if(keyDown("right")) {
    contra.x = contra.x + 10;
    contra.changeAnimation("contra", contraAnimation);
  }
  else if(keyDown("left")) {
    contra.x = contra.x - 10;
    contra.changeAnimation("contra", contraAnimation);
  }
  else{
    contra.changeAnimation("shooting", contrashooting);
  }

}

function spawnBlock() {
  for (var i = 0; i < 100000; i+=500) {
    allBlocks.push(createSprite(200 + i, (350/1000)*windowHeight, 50, 50));
    
  }
  for (var i = 0; i < 200; i++) {
    allBlocks[i].shapeColor = "red";
    allBlocks[i].addImage("block", blockImg);
    
  }
}



function gameCamera() {
  camera.position.x = contra.x;
  camera.position.y = contra.y;
}



