const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color = 'red', offset }){
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x ,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.helth = 100;
    }

    draw(){
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        //attack box
        if(this.isAttacking){
            context.fillStyle = 'green';
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    updates(){
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }else{
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}

const player = new Sprite({
  position:{
    x: 0,
    y: 0
  },
  velocity:{
    x: 0,
    y: 10
  },
  offset: {
      x: 0,
      y: 0
  }
})


const enemy = new Sprite({
    position:{
      x: 400,
      y: 100
    },
    velocity:{
      x: 0,
      y: 0
    },
    color : 'blue',
    offset: {
        x: 50,
        y: 0
    }
  })


console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

//collision possition
function rectengularCollision({rectangel1, rectangle2}) {
    return(
        player.attackBox.position.x + rectangel1.attackBox.width >= rectangle2.position.x && 
        player.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        player.attackBox.position.y + rectangel1.attackBox.height >= rectangle2.position.y &&
        player.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

//select winner
function determineWinner({player, enemy, timerID}){
    clearTimeout(timerID)
    document.querySelector('#game-tie').style.display = 'flex';
    if(player.helth === enemy.helth){
            document.querySelector('#game-tie').innerHTML = 'Tie';
        }else if(player.helth > enemy.helth){
            document.querySelector('#game-tie').innerHTML = 'Player 1 Wins';
        }else if(player.helth < enemy.helth){
            document.querySelector('#game-tie').innerHTML = 'Player 2 Wins';
        }
}

//game timer
let timer = 60;
let timerID;
function decreseTimer(){
    if(timer > 0) {
        timerID = setTimeout(decreseTimer, 1000);
        timer--;
        document.querySelector('#game-timer').innerHTML = timer;
    }

    //win statement
    if(timer === 0){
        determineWinner({player, enemy, timerID})
    }
}

decreseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    context.fillStyle ='black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.updates();
    enemy.updates();

player.velocity.x = 0;
enemy.velocity.x = 0;

    //player1 movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
    }

    //player2 movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }

    //detect for collision
    if(
        rectengularCollision({
            rectangel1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
        ){
        player.isAttacking = false;
        enemy.helth -= 20;
        document.getElementById('enemy-helth').style.width = enemy.helth + '%';
    }

    if(
        rectengularCollision({
            rectangel1: player,
            rectangle2: enemy
        }) &&
        enemy.isAttacking
        ){
        enemy.isAttacking = false;
        player.helth -= 20;
        document.getElementById('player-helth').style.width = player.helth + '%';
    }

    //game end based on helth
    if(enemy.helth <= 0 || player.helth <= 0){
        determineWinner({player, enemy, timerID});
    }
}

animate();

window.addEventListener('keydown', (event) =>{
    switch(event.key){
        //player1 keys
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break
        case 'w':
            player.velocity.y = -20;
        break
        case ' ':
            player.attack();
        break

        //player2 keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break
        case 'ArrowUp':
            enemy.velocity.y = -20;
        break
        case 'ArrowDown':
        enemy.attack();
        break
    }
})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        //player1 keys
        case 'd':
            keys.d.pressed = false;
        break
        case 'a':
            keys.a.pressed = false;
        break

        //player2 keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break
    }
})