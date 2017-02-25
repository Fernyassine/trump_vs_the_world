//Const
var SPRITE_WIDTH  = 192,
    SPRITE_HEIGHT = 165,
    
    PLAYER_WALK       = 0,
    PLAYER_BACK       = 1,
    PLAYER_JUMP       = 2,
    PLAYER_FIGHT      = 3,
    PLAYER_DEATH      = 4,
    PLAYER_BACK_JUMP  = 5,
    PLAYER_BACK_FIGHT = 6,
    
    NB_PIXEL_JUMP = 10,
    
    MAX_PLAYER_LIFE = 6, 
    MAX_PLAYER_AMMO = 15,
    
    ANIMATION_DURATION = 9;

//Trump
function Player(playerName) {    
    //Vars relative to the player
    var name  = playerName || 'Donald D. Trump',
        hud = new HUD(name),
        dead  = false;
    
    //Vars relative to the sprite
    var posX     = 650,
        posY     = WORLD_GROUND + SPRITE_HEIGHT / 2.5,
    
        width    = SPRITE_WIDTH,
        height   = SPRITE_HEIGHT,
        spriteX  = 0,
        spriteY  = 0,
        
        speed    = 100,
        
        nbFrameWalking  = 0,
        nbFrameBackward = 0,
        nbFrameJumping  = 0,
        nbFrameAttack   = 0,
        
        jumping = false,
        attacking = false,
        jumpingBase = posY,
        
        fireballArray = [],
        nbKilled = 0;
    
    function draw(ctx, sprite, life, life_bis, sprite_ammo, sprite_ammo_bis, sprite_attack) { 
        ctx.drawImage(sprite,
                     spriteX, spriteY,
                     width, height,
                     posX, posY,
                     width, height);
        
        hud.draw(ctx, life, life_bis, sprite_ammo, sprite_ammo_bis);
        var txt = "Hilary's minions killed : " + nbKilled;
        ctx.fillText(txt, WORLD_WIDTH - (txt.length * 10), 30);
        
        for(var i = 0; i < fireballArray.length; i++) 
            fireballArray[i].draw(ctx, sprite_attack);
    }
    
    function calcFrameToDraw (frameX, frameY) {
        //frameX = numéro de la frame à dessiner
        //frameY = numéro de la ligne ou récupérer le sprite à dessiner
        spriteX = SPRITE_WIDTH * frameX;
        spriteY = SPRITE_HEIGHT * frameY;
    }
    
    function updatePlayerLife() {
        for(var i = 0; i < enemiesArray.length; i++) {
            var enemy = enemiesArray[i];
            
            if(enemy.x < - enemy.width) {
                hud.decremLife();
                enemiesArray.splice(i, 1);
            }
        }            
    }
    
    function updateFireballs(ctx, delta, sprite_attack, sprite_bonus) {
        for(var i = 0; i < fireballArray.length; i++) {
            fireballArray[i].move(delta);
            fireballArray[i].draw(ctx, sprite_attack);
            
            for(var j = 0; j < enemiesArray.length; j++) {
                if(fireballArray[i].collide(enemiesArray[j])) {
                   fireballArray.splice(i, 1);
                    
                    enemiesArray[j].decremLife();
                    
                    if(enemiesArray[j].life <= 0) {
                        generateBonusAmmo(enemiesArray[j].x, enemiesArray[j].y);
                        enemiesArray.splice(j, 1);
                        nbKilled++;
                    }
                      
                    break;
                }
            }
        }
    }
    
    function updatePosition(ctx, delta, sprite_attack, sprite_bonus) {
        var speedX = 0, speedY = 0;    
        
        //check inputstates
        if(inputStates.shift) {
            speed = 250;
        } else {
            speed = 100;
        }          
            
        if(inputStates.left) {    
            if(posX <= -50)
                speedX = 0;
            else
                speedX = -speed;
            
            calcFrameToDraw(Math.floor(nbFrameBackward / ANIMATION_DURATION) % 4, PLAYER_BACK);
            nbFrameBackward++;
        }

        if(inputStates.right) {
            if(posX >= WORLD_WIDTH - width)
                speedX = 0;
            else
                speedX  = speed;
            
            calcFrameToDraw(Math.floor(nbFrameWalking / ANIMATION_DURATION) % 4, PLAYER_WALK);
            nbFrameWalking++;  
        } 
        
        if(inputStates.space) {
            if(!jumping) {//The jump start
                jumping = true;
                jumpingBase = posY;
            }
        }
                
        if(jumping) { 
            if(inputStates.left)
                calcFrameToDraw(Math.floor(nbFrameJumping / ANIMATION_DURATION  % 4), PLAYER_BACK_JUMP); 
            else
                calcFrameToDraw(Math.floor(nbFrameJumping / ANIMATION_DURATION  % 4), PLAYER_JUMP);      
            
            if((Math.floor(nbFrameJumping / ANIMATION_DURATION) % 4) < 2)
                posY -= NB_PIXEL_JUMP;
            else
                posY += NB_PIXEL_JUMP;
            
            nbFrameJumping++; 
            
            bonusColide();
        }
        
        if(jumping && nbFrameJumping > (4 * ANIMATION_DURATION) - 1) {
            jumping = false; //End of the jump
            posY = jumpingBase;   
            nbFrameJumping = 0;  
        }       
        
        if(inputStates.attack) {
            if(!attacking && hud.getInfo().ammo > 0) {
                attacking = true;
                
                var fireball;
                
                if(inputStates.left)
                    fireball = new FireBall(posX, posY + (height / 3), 10);
                else
                    fireball = new FireBall(posX + width / 2, posY + (height / 3));
                
                fireballArray.push(fireball);
                hud.decremAmmo();                
            }
        }  
        
        if(attacking) {   
            if(inputStates.left)
                calcFrameToDraw(Math.floor(nbFrameAttack / ANIMATION_DURATION) % 4, PLAYER_BACK_FIGHT);
            else
                calcFrameToDraw(Math.floor(nbFrameAttack / ANIMATION_DURATION) % 4, PLAYER_FIGHT);
            
            nbFrameAttack++;
        }
        
        if(attacking && nbFrameAttack > (4 * ANIMATION_DURATION) - 1) {
            attacking = false;
            nbFrameAttack = 0;
            
            calcFrameToDraw(0, 0);
        }
                
        //Compute the incX and inY in pixels depending on the time elapsed since last redraw
        posX += calcDistanceToMove(delta, speedX);
        posY += calcDistanceToMove(delta, speedY);  
        
        updatePlayerLife();
        updateFireballs(ctx, delta, sprite_attack, sprite_bonus);
    }
    
    function bonusColide() {
        for(var i = 0; i < bonusArray.length; i++) {
            if(bonusArray[i].getPos().x > posX && bonusArray[i].getPos().x < posX + width / 1.7
                && bonusArray[i].getPos().y > posY && bonusArray[i].getPos().y < posY + height) {
                hud.incremAmmo(5);
                bonusArray.splice(i, 1);   
            }
        }
    }
    
    //API
    return {
        draw: draw,
        updatePosition: updatePosition,
        hud: hud
    };
}

var calcDistanceToMove = function (delta, speed) {
    return (speed * delta) / 1000;
};

function FireBall(x0, y0, angle) {
    var x = x0, y = y0, 
        angle = angle || 50,
        v = 500,
        radius = 30 / 2;
    
    function draw(ctx, sprite_attack) {        
        ctx.drawImage(sprite_attack,
             0, 0,// Image source --> Origine X et Origine Y à partir desquelles on dessinera l'image source
             200, 200, // Taille de l'image à dessiner --> Largeur, Hauteur
             x, y, // Image destination --> Origine X et Origine Y où sera dessiné l'image source
             70, 70); // Echelle de l'image à dessiner
    }
    
    function move(delta) {
        var incX = v * Math.cos(angle);
        
        x += calcDistanceToMove(delta, incX);
    }
    
    function collide(enemy) {
        if(x > (enemy.x + enemy.width) || x < (enemy.x + (radius * 2)))
           return false;
        else {
            if((y > enemy.y + enemy.height) || y < enemy.y)
                return false;
            else
            return true;
        }
    }
    
    return {
        draw: draw,
        move: move,
        collide: collide
    };
}

//Objet HUD
function HUD(playerName) {
    var name   = playerName,
        life = MAX_PLAYER_LIFE,
        ammo = MAX_PLAYER_AMMO;   
    
    //Récupère le nombre de vies et de munitions
    function getInfo() {
        return {life, ammo};
    }
    
    //Health & magic
    function incremLife() {
        life++;
    }
    
    function decremLife() {
        if(life > 0)
            life--;
    }
    
    function incremAmmo(nb) {
        if(ammo + nb > MAX_PLAYER_AMMO)
            ammo = MAX_PLAYER_AMMO;
        else
            ammo += nb;
    }
    
    function decremAmmo() {
        if(ammo > 0)
            ammo--;
    }
        
    //Dessine le HUD à l'écran
    function draw (ctx, sprite_life, sprite_life_bis, sprite_ammo, sprite_ammo_bis){           
        //PLAYER NAME
        ctx.fillText(playerName, 40, 30);
        
        drawHUDBar(ctx, life, MAX_PLAYER_LIFE, sprite_life, sprite_life_bis, 1, 40, 40);
        drawHUDBar(ctx, ammo, MAX_PLAYER_AMMO, sprite_ammo, sprite_ammo_bis, 2.5, 20, 65);
    }
    
    function drawHUDBar(ctx, length, max, sprite, sprite_bis, scale, x, y) {
        for(var i = 1; i <= length; i++) {
            ctx.drawImage(sprite,
                         0, 0,// Image source --> Origine X et Origine Y à partir desquelles on dessinera l'image source
                         200, 200, // Taille de l'image à dessiner --> Largeur, Hauteur
                         x * i, y, // Image destination --> Origine X et Origine Y où sera dessiné l'image source
                         25 * scale, 25 * scale); // Echelle de l'image à dessiner
        } 
        
        for(var i = length + 1; i <= max ; i++) {
            ctx.drawImage(sprite_bis,
                         0, 0, // Image source --> Origine X et Origine Y à partir desquelles on dessinera l'image source
                         200, 200, // Taille de l'image à dessiner --> Largeur, Hauteur
                         x * i, y, // Image destination --> Origine X et Origine Y où sera dessiné l'image source
                         25 * scale, 25 * scale); // Echelle de l'image à dessiner
        }
    }
    
    //API
    return {
        getInfo: getInfo,
        incremLife: incremLife,
        decremLife: decremLife,
        incremAmmo: incremAmmo,
        decremAmmo: decremAmmo,
        draw: draw
    };
}