var PLAY = 1;
var END = 0;
var gameState = PLAY;

var road;

var trex, trex_running, trex_collided, trex_jumping, trex_flying;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var jackpot;
var smoke, smoke_smoking;
var diamond, diamond_rotating;
var tree, treeImage;

var hail, hail_dropping;

var diamon;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound, scoreSound, diamondSound, jackpotSound, flyingSound;

var invisibleBlock;

function preload(){
  road_running = loadImage("background.png");

  trex_running = loadAnimation("man1.png", "man2.png", "man3.png", "man4.png", "man5.png", "man6.png", "man7.png");
  trex_collided = loadAnimation("mandie6.png");
  trex_jumping = loadAnimation("manjump1.png", "manjump2.png", "manjump3.png", "manjump4.png");
  trex_flying = loadAnimation("manfly.png");
  
  groundImage = loadImage("ground2.png");
  
  coinImage = loadImage("coin1.png", "coin2.png", "coin3.png", "coin4.png", "coin5.png", "coin6.png", "coin7.png", "coin8.png", "coin9.png", "coin10.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  jackpot_flying = loadImage("Jackpot.png");
  smoke_smoking = loadAnimation("smoke1.png", "smoke2.png", "smoke3.png", "smoke4.png", "smoke5.png");
  diamond_rotating = loadAnimation("diamond1.png", "diamond2.png");
  treeImage = loadImage("tree.png");


  hail_dropping = loadImage("hail1.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("DiamondSound.mp3")
  scoreSound = loadSound("coinsound.mp3");
  diamondSound = loadSound("DiamondSound.mp3");
  jackpotSound = loadSound("jackpotsound.mp3");
  flyingSound = loadSound("flyingsound.mp3");
}

function setup() {
  createCanvas(500, 340);

  road=createSprite(1000,170);
  road.addImage(road_running);
  road.velocityX = -4;
  road.scale = .4
  road.x = road.width /5;


  var message = "This is a message";
  console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("jumping", trex_jumping);
  trex.addAnimation("flying", trex_flying);
  

  trex.scale = 2;
  
  ground = createSprite(200,310,400,20);
  ground.addImage("ground",groundImage);
  ground.velocityX = -4
  ground.x = ground.width /2;
  ground.visible = false

  gameOver = createSprite(230,150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 10
  
  restart = createSprite(230, 200);
  restart.addImage(restartImg);
  restart.scale = .1
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,310,400,10);
  invisibleGround.visible = false;

  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  coinsGroup = createGroup();
  jackpotsGroup = createGroup();
  invisibleBlocksGroup = createGroup();
  smokesGroup = createGroup();
  diamondsGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,30,30);
  //trex.debug = true;

  score = 0;
  diamon = 0;
  
}

function draw() {
  
  background("white");
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(5.3 + score/100);
    
    
    if(diamon > 20){
       checkPointSound.play()
       obstaclesGroup.velocityX = -(7 + score/1000);
       ground.velocityX = -(7 + score/1000);
       coinsGroup.velocityX = -(7 + score/1000);
       jackpotsGroup.velocityX = -(7 + score/1000);
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (road.x < 0){
      road.x = road.width/8;
    }

    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 200) {
      smokesGroup.destroyEach();
        trex.velocityY = -13;
        trex.changeAnimation("jumping", trex_jumping);
        jumpSound.play();
    
    }

    if(trex.isTouching(ground)) {
      trex.changeAnimation("running", trex_running);
      
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    

    //spawn the clouds
    spawnCoins();
  
    //spawn obstacles on the ground
    spawnObstacles();

    //spawn Hails on the ground
    Hails();

    //spawn Jackpot on the ground
    Jackpot();

    //spawn Tree on the ground
    Tree();

    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }

    if(coinsGroup.isTouching(trex)) {
      score=score+10;
      scoreSound.play();
      coinsGroup.destroyEach();

    }

    if(jackpotsGroup.isTouching(trex)) {
         
      coinsGroup.y = 120;
      jackpotSound.play();

      var invisibleBlock = createSprite(100, 170, 4100, 340);
      invisibleBlock.velocityX = -5;
      invisibleBlocksGroup.add(invisibleBlock);
      invisibleBlock.visible = false;

      var smoke = createSprite(140, 120, 40, 10);
      smoke.addAnimation("smoking", smoke_smoking);
      smokesGroup.add(smoke);
      

    }

    if(invisibleBlocksGroup.isTouching(trex)) {
      trex.x = 200;
      trex.y = 120;
      trex.changeAnimation("flying", trex_flying);
    
      obstaclesGroup.destroyEach();
      jackpotsGroup.destroyEach();   
      
      Diamond();
    }

    if(diamondsGroup.isTouching(trex)) {
      diamondsGroup.destroyEach();
      diamondSound.play();
      diamon=diamon+1;
      score = score+30;
    }
    if(trex.y >= 170) {
        smokesGroup.destroyEach();
    }
    
 }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
     trex.changeAnimation("collided", trex_collided);
  
     
      road.velocityX = 0
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     coinsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }

    road.depth=text.depth;
    text.depth=text.depth+1;

  drawSprites();
  textSize(20);
  fill("skyblue")
  text("COINS: "+ score, 40,50);

  textSize(20);
  fill("white");
  text("DIAMONDS: "+diamon, 350, 50);
  
}


function reset(){
  gameState = PLAY;
  road.velocityX = -4;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  trex.changeAnimation("running")
  score=0;
  diamon = 0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(620,295,10,40);
   obstacle.velocityX = -(5 + score/500);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    //obstacle.debug = true
    obstacle.lifetime = -300;
    obstacle5.scale = .1
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }

 obstaclesGroup.depth=coinsGroup.depth;
 

}





function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 90 === 0) {
    var coin = createSprite(620,295,40,10);
    //coin.y = Math.round(random(270,300));

    coin.addImage(coinImage);
    coin.scale = 0.5;
    coin.velocityX = -(5 + score/500);
    
     //assign lifetime to the variable
    coin.lifetime = -200;
    
    //adjust the depth
    coin.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  

 

}

function Hails() {
  if (frameCount % 40 === 0) {
    var hail = createSprite(610,15,40,10);
    hail.x = Math.round(random(20,470));
    hail.addImage(hail_dropping)
    hail.scale = 1;
    hail.velocityY = (1 + score/500);
    
    //adjust the depth
    trex.depth = hail.depth;
    hail.depth = hail.depth + 1;
    
  }
}

function Jackpot() {
  if (frameCount % 500 === 0) {
    var jackpot = createSprite(620,295,40,10);
    //jackpot.y = Math.round(random(20,470));
    jackpot.addImage(jackpot_flying);
    jackpot.scale = .6;
    jackpot.velocityX = -(5 + score/500);
    
    jackpotsGroup.add(jackpot);

  }
}



function Diamond() {
  if (frameCount % 40 === 0) {
    var diamond = createSprite(620,120,10,10);
    //jackpot.y = Math.round(random(20,470));
    diamond.addAnimation("rotating", diamond_rotating);
    diamond.scale = .6;
    diamond.velocityX = -15;
    
    diamondsGroup.add(diamond);

    diamond.depth = trex.depth;
    trex.depth = trex.depth+1;
  }
  
}



function Tree() {
  if (frameCount % 1110 === 0) {
    var tree = createSprite(620,210,100,100);
    tree.addImage(treeImage);
    tree.velocityX = -(5.3 + score/100);

    tree.depth = trex.depth;
    trex.depth = trex.depth + 1;
    tree.depth = obstaclesGroup.depth;
    obstaclesGroup.depth = obstaclesGroup.depth + 1;
    tree.depth = coinsGroup.depth;
    coinsGroup.depth = coinsGroup.depth + 1;


}


}