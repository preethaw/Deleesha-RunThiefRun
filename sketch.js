const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var myengine, myworld;


const PLAY = 1;
const END = 2;
const CHANGE = 3;

var gameState = PLAY;

var score = 0;
var life = 5;
var level = 1;

var start,next;
var back, backgroundImg,backgroundLevel1,backgroundLevel2, endBack;
var ground ;
var player , playerImg;
var obstacle1 ,obstacle2;

var scoreImg , scoreboard;
var lifeImg1,lifeImg2,lifeImg3,lifeImg4,lifeImg5, displayLife;

var gameOver,gameOverImg;

function preload(){
  start = loadImage("images/startingImg.jpg")
  backgroundLevel1 = loadImage("images/fort.jpg");
  backgroundLevel2 = loadImage("images/forest1.png");
  endBack = loadImage("images/blackImg.jpg");

  obstacleImg1 = loadImage("images/obstacle1.png");
  obstacleImg2 = loadImage("images/obstacle2.png");
  image2 = loadImage("images/obstacle2.png");

  playerAnim = loadAnimation("images/player1.png","images/player2.png","images/player3.png","images/player4.png");

  arrowImage = loadImage("images/arrow.png");

  scoreImg = loadImage("images/scoreboard.png");

  lifeImg1 = loadImage("images/heart1.png");
  lifeImg2 = loadImage("images/heart2.png");
  lifeImg3 = loadImage("images/heart3.png");
  lifeImg4 = loadImage("images/heart4.png");
  lifeImg5 = loadImage("images/heart5.png");

  gameOverImg = loadImage("images/game over.png")
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
 
  myengine = Engine.create();
  myworld = myengine.world;
  
  back = createSprite(width / 2,height / 2,width,height);
  back.velocityX = -5;
  back.addImage("fort",backgroundLevel1);
  back.addImage("forest",backgroundLevel2);
  back.addImage("end",endBack);
  back.scale= 2.97;

  ground = new Ground(width/2 ,height - 100,width,20);
 
  player = createSprite(width/8,height-200);
  player.addAnimation("player Running",playerAnim);

  displayLife = createSprite(width-1430,height/3.5);
  displayLife.addImage("heart1",lifeImg1);
  displayLife.addImage("heart2",lifeImg2);
  displayLife.addImage("heart3",lifeImg3);
  displayLife.addImage("heart4",lifeImg4);
  displayLife.addImage("heart5",lifeImg5);

  scoreboard = createSprite(width-300,height/6,50,50);
  scoreboard.addImage(scoreImg);
  score.scale = 0.5;

  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  obstaclesGroup = new Group();
  arrowGroup = new Group();



  Engine.run(myengine);

}

function draw() {

  background(0);  
  Engine.update(myengine);

 
  drawSprites();

  if(gameState === PLAY){

          destroyObstacle();
          spawnObstacles();
          moveBackground();
          destroyPlayer();

          if(score > 5 && level === 1 ){
              gameState = CHANGE;
              loadLevel2();
          }

      }

      else if(gameState === END){

        back.changeImage("end",endBack);
        gameOver.visible = true;
        displayLife.visible = false;
        scoreboard.visible = false;
        
        arrowGroup.destroyEach();
        obstaclesGroup.destroyEach();
        back.velocityX = 0;
  
      }
 
  scoreBoard();

}

function keyPressed(){


    if(keyCode === UP_ARROW && gameState === PLAY){
        createArrow();
    }

}

function spawnObstacles(){
  if (frameCount % 100 === 0){
    var obstacle = createSprite(width,height-200,10,40);
    obstacle.velocityX = -10 - score;
    
     //generate random obstacles
     var rand = Math.round(random(1,2));
     switch(rand) {
       case 1: obstacle.addImage(obstacleImg1);
               break;
       case 2: obstacle.addImage(obstacleImg2);
               break;

       default: break;
     }
    
     obstaclesGroup.add(obstacle);
  }
 }

 function createArrow(){

    var arrow = createSprite(player.x,player.y);
    arrow.velocityX = 10;
    arrow.addImage(arrowImage);
    arrow.scale = 0.5;

    arrowGroup.add(arrow);
 }

 function destroyObstacle(){

    for(var i=0; i<obstaclesGroup.length; i++){
      if(obstaclesGroup.get(i).isTouching(arrowGroup)){
          obstaclesGroup.get(i).destroy();
          arrowGroup.destroyEach();
          score = score+1;
      }
      }

 }

 function destroyPlayer(){

    if(obstaclesGroup.isTouching(player)){

          for(var i=0; i<obstaclesGroup.length; i++){
            if(obstaclesGroup.get(i).isTouching(player)){
                obstaclesGroup.get(i).destroy();
                life = life - 1;
            }
            }
    }

    if(life === 0){

      player.destroy();

      gameState = END;
    }

 }

 function moveBackground(){

    if(back.x < 0){
      back.x = displayWidth/2;
    }

 }

 function endGame(){

    if(life === 0){
        gameState = END;
    }

 }

 function scoreBoard(){

  
  textStyle(BOLD);
  textSize(45);
  fill(247,99,94);

  fill(0)
  textFont("calibri");
  text("LIFE : " + life , width-1500,height/8);

  fill("black");
  textFont("Algerian");
  text("SCORE :" , width-420,height/5.5);

  textSize(40);
  text(score, width-245,height/5.5);

  switch(life){
    
  case 1 : displayLife.changeImage("heart5",lifeImg5);
             break;
             
  case 2 : displayLife.changeImage("heart4",lifeImg4);
             break;

  case 3 : displayLife.changeImage("heart3",lifeImg3);
             break;

  case 4 : displayLife.changeImage("heart2",lifeImg2);
             break; 

  case 5 : displayLife.changeImage("heart1",lifeImg1);
            break;

   default:  break;          
  }

  
 }

 function loadLevel2(){

  back.changeImage("forest",backgroundLevel1);
  back.scale = 2.97;

  if(life < 5 && gameState === CHANGE ){
      life =life + 1;
  } 
      gameState = PLAY;
      level = 2

 }

