class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElepsed = 0;
        this.framesHold = 6;
    }

    draw(){
        context.drawImage(
            this.image, 
            //crop shop img and loop it
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            //background position
            this.position.x, 
            this.position.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    updates(){
        this.draw();
        this.framesElepsed++;
        //shop img animation loop
        if(this.framesElepsed % this.framesHold === 0){
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }else{
                this.framesCurrent = 0;
            }
        }
    }
}

class Fighter {
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

        //gravitation
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 97){
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