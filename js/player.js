class Player {
    constructor(name,direction,startX, startY, lifeSetup, pointSetup) {
        this.name = name;
        this.direction = direction;
        this.startDirection = direction;
        this.targetedDirection = direction;
        this.nbTurnStunned = 0;
        this.points = 0;
        this.startX = startX;
        this.startY = startY;
        this.lifeSetup = lifeSetup;
        this.lifes = [];
        this.numberLife = maxLife;
        this.body = [];
        this.InitLife();
        this.Restart();
        this.pointsText = game.add.text(pointSetup.x, pointSetup.y, '00', { fontSize: '32px', fill: '#fff' });
        this.oldX;
        this.oldY;
        
        this.emitter = game.add.emitter(0,0,30);
        this.emitter.makeParticles('stars',[0]);
        this.emitter.maxParticleScale = 0.4;
        this.emitter.minParticleScale = 0.2;
    }
    
    Restart(){
        this.direction=this.startDirection;
        this.targetedDirection = this.startDirection;
        if(this.body.length > 0) {
            for (var i = 0; i < this.body.length; i++) {
                this.body[i].kill();
            }
        }
        this.body = [];
        /*for(var i=p1.body.length-1; i => 0;i--){
            //p1.body[i] = null;
            p1.body[i].kill();
            //this.body.pop();
        }*/
        for(var i = 0; i<5; i++){
            var tbody = game.add.sprite(this.startX, this.startY, this.name);
            tbody.scale.setTo(0.5, 0.5);
            this.body.push(tbody);
        }
    }
    
    IncreaseSize(){
		if(this.body.length != 0) {
			var x = this.body[this.body.length-1].x;
			var y = this.body[this.body.length-1].y;
		}
		var corps = game.add.sprite(x, y, this.name);
        corps.scale.setTo(0.5, 0.5);
		this.body.push(corps);
    }

    InitLife() {
        for(var i = 0; i < maxLife; i++) {
            var x;
            if(this.lifeSetup.direction == 'right') {
                x = this.lifeSetup.x + (30 * i+1);
            } else {
                x = this.lifeSetup.x - (30 * i+1);
            }
            var star = game.add.sprite(x, this.lifeSetup.y, 'stars');
            star.scale.setTo(0.5, 0.5);
            star.frame = this.lifeSetup.icon;
            this.lifes.push(star);
        }
    }
    
    Win(){
        this.point += 1;
        Game.Reset();
    }
    
    Update(){
        if(this.nbTurnStunned > 0){
            this.nbTurnStunned -=1;
        }
        else{
            this.UpdateDirection();
            this.Move();
        
            if(this.CollideSelf() && debug == false){
                this.LoseLife();
            // game.state.start('Game_Over');
            //Game.SetLooser(this);
                return false;
            }

            if(this.CollideWall() && debug == false) {
                this.LoseLife();
            //this.Stun(4);
            //return true;
            // game.state.start('Game_Over');
            //Game.SetLooser(this);
                return false;
            }

            if(this.CollideStar()){
                this.IncreaseSize();
                this.IncreasePoint();
                star.kill();
                Game.popStar();
            }
        }
        return true;
    }
    
    
    Move(){

        this.oldX = this.body[0].x;
        this.oldY = this.body[0].y;
        
        switch(this.direction){
            case direction.left:
                this.body[0].x -= sizeElement;
                break;
            case direction.right:
                this.body[0].x += sizeElement;
                break;
            case direction.up:
                this.body[0].y -= sizeElement;
                break;
            case direction.down:
                this.body[0].y += sizeElement;
                break;
        } 
        var tempX, tempY;
        for (var i = 1; i < this.body.length; i++) {
            tempX = this.body[i].x;
            tempY = this.body[i].y;
            
            this.body[i].x= this.oldX;
            this.body[i].y= this.oldY;

            this.oldX = tempX;
            this.oldY = tempY;
        }
    }

    RevertMove(){
        
        var tempX, tempY;
        for(var i = this.body.length-1;i>=0;i--){
            console.log(this.oldY);
            tempX = this.body[i].x;
            tempY = this.body[i].y;
            
            this.body[i].x= this.oldX;
            this.body[i].y= this.oldY;
            
            this.oldX = tempX;
            this.oldY = tempY;
        }
    }
    
    
    TargetedDirection(direction){
        this.targetedDirection = direction;
    }
    
    UpdateDirection(direction){
        if(this.targetedDirection != this.direction && this.targetedDirection != (this.direction+2)%4){
            this.direction=this.targetedDirection;
        }
        
    }
    
    GetBodyDirection(index) {
        if(index<1){
            console.log("Error, GetBodyDirection can't be computed without a prior element")
            return null;
        }else{
            if(this.body[index-1].x == this.body[index].x){
                if(this.body[index-1].y < this.body[index].y){
                    return direction.up;
                }else{
                    return direction.down;
                }
            }else{
                if(this.body[index-1].x < this.body[index].x){
                    return direction.right;
                }else{
                    return direction.left;
                }
            }
        }
    }
    
    CollideSelf() {
		var head = this.body[0];

		for (var i = 1; i < this.body.length; i++) {
			if(this.body[i].x == head.x && this.body[i].y == head.y) {
				return true;
			}
		}

		return false;
    }
    
    CollideWall() {
		var head = this.body[0];
        return head.x > gamearea.right - sizeElement || head.x < gamearea.left || head.y < gamearea.top || head.y > gamearea.bottom - sizeElement;
	}
    
    CollideStar() {
        for (var i = 0; i < this.body.length; i++) {
            if(this.body[i].x == star.x && this.body[i].y == star.y ) {
                coinfx.play();
                return true;
            }
        }

        return false;
    }
    
    CollideBetween(p2){
        //check head vs head condition
        if(this.body[0].x == p2.body[0].x && this.body[0].y == p2.body[0].y){
            //frontal colision
            if((this.direction+2)%4==p2.direction){
                this.Stun(4);
                p2.Stun(4);
                electroHammer.play();
                return false;
            }
            if((this.direction+1)%4 == p2.direction){
                return this; //this win
            } else {
                return p2 //p2 win
            }
        }
        //check this head vs p2 body
        var head = this.body[0];
        for (var i = 1; i < p2.body.length; i++) {
            if(p2.body[i].x == head.x && p2.body[i].y == head.y) {
                return p2;
                
                /*
                var dir = p2.GetBodyDirection(i);
                switch(dir){
                    case direction.left:
                        if(this.direction = direction.up){
                            this.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(this.direction = direction.down){
                            return this;
                        }
                        break;
                    case direction.right:
                        if(this.direction = direction.down){
                            this.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(this.direction = direction.up){
                            return this;
                        }
                    case direction.up:
                        if(this.direction = direction.right){
                            this.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(this.direction = direction.left){
                            return this;
                        }
                    case direction.down:
                        if(this.direction = direction.left){
                            this.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(this.direction = direction.right){
                            return this;
                        }
                }
                //*/
            }
        }
        
        //check p2 head vs this body
        var head = p2.body[0];
        for (var i = 1; i < this.body.length; i++) {
            if(this.body[i].x == head.x && this.body[i].y == head.y) {
                return p1;
                
                                /*
                var dir = this.GetBodyDirection(i);
                switch(dir){
                    case direction.left:
                        if(p2.direction = direction.up){
                            p2.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(p2.direction = direction.down){
                            return p2;
                        }
                        break;
                    case direction.right:
                        if(p2.direction = direction.down){
                            p2.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(p2.direction = direction.up){
                            return p2;
                        }
                    case direction.up:
                        if(p2.direction = direction.right){
                            p2.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(p2.direction = direction.left){
                            return p2;
                        }
                    case direction.down:
                        if(p2.direction = direction.left){
                            p2.Stun(3);
                            electroHammer.play();
                            return false;
                        }
                        if(p2.direction = direction.right){
                            return p2;
                        }
                }
                //*/
 
            }
        }
        return false;
    }

    LoseLife() {
        if(this.numberLife > 0) {
            looseLifefx.play();
            this.numberLife -= 1;
            this.lifes[this.numberLife].frame = 1;
        }
    }

    IncreasePoint() {
        this.points += 1;
        var p = (this.points < 10) ? '0' + this.points.toString() : this.points.toString();
        this.pointsText.text = p;
    }
    
    Stun(nbTurn)
    {
        this.nbTurnStunned = nbTurn;
        //revert head movement to avoid multiple colision
        this.RevertMove();
        //Game.emitParticle(this.body[0].x,this.body[0].y,10)
        this.emitter.x = this.body[0].x;
        this.emitter.y = this.body[0].y;
        
        this.emitter.start(true,2000,null,10);
        
    }
}