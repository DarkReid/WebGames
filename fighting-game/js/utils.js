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