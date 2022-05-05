const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 650,
        y: 161
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
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


const enemy = new Fighter({
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

decreseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    context.fillStyle ='black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.updates();
    shop.updates();
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