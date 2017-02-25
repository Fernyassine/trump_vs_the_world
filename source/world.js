var SPRITE_GRD_WIDTH  = 255,
    SPRITE_GRD_HEIGHT = 150,
    
    GROUND_Y_START  = 700,
    
    WORLD_WIDTH  = 1600,
    WORLD_HEIGHT = 800,
    
    WORLD_GROUND = 590,
    
    enemiesArray = [],
    bonusArray = [],
    
    FrameCpt = 0,
    maxEnemy = 5,
    
    GAME_SCALE = 1;

function World() {
    var posX = 0,
        posY = GROUND_Y_START,
        
        spriteX = 515,
        spriteY = 398,
        
        scrolling = 0;
    
    function draw(ctx, bg, ground) {
        var limit = Math.round(WORLD_WIDTH / SPRITE_GRD_WIDTH);
                
        ctx.drawImage(bg,
                     scrolling, 400,
                     1920, 1080,
                     0, 0,
                     1920 * GAME_SCALE, 1080 * GAME_SCALE);
        
        for(var i = 0; i <= limit; i++){
            ctx.drawImage(ground,
                     spriteX, spriteY,
                     SPRITE_GRD_WIDTH, SPRITE_GRD_HEIGHT,
                     posX + (SPRITE_GRD_WIDTH * i), posY + 80,
                     SPRITE_GRD_WIDTH, SPRITE_GRD_HEIGHT);
        }
    }
    
    return {
        draw: draw
    }
}

function generateBonusAmmo(x, y) {
    var createBonus = (Math.floor(Math.random() * 30) % 3) === 0;
    
    if(createBonus) {
        var bonus = new Bonus(x, y);
        bonusArray.push(bonus);
    }
}

function Ennemy(x, y, angle, v, diameter, color, life, sprite) {
    this.x = x;
    this.y = y;
    this.spriteX = 0;
    this.spriteY = 0;
    this.angle = angle;
    this.v = v;
    this.radius = diameter / 2;
    this.color = color || 'red';
    this.life = life || '5';
    this.width = 95;
    this.height = 95;
    this.sprite = sprite;
    
    this.draw = function(ctx) {        
        ctx.drawImage(this.sprite,
                     this.spriteX, this.spriteY,
                     this.width, this.height,
                     this.x, WORLD_GROUND + 55,
                     this.width, this.height);
        
        ctx.fillStyle = this.color;
        for(var i = 0; i < this.life; i++) {
            ctx.fillRect((this.x) + 20 * i,
                         this.y - 10,
                         15, 5);
        }
    };
    
    this.move = function(delta, frameX, frameY) {     
        var incX = this.v * Math.cos(this.angle);
        
        this.x -= calcDistanceToMove(delta, incX);
        
        this.calcFrameToDraw(frameX, frameY);
    };
    
    this.decremLife = function() {
        this.life--;
    };
    
    this.incremLife = function() {
        this.life++;
    };
    
    this.calcFrameToDraw = function(frameX, frameY) {
        //frameX = numéro de la frame à dessiner
        //frameY = numéro de la ligne ou récupérer le sprite à dessiner
        this.spriteX = this.width * frameX;
        this.spriteY = this.height * frameY;
    };
}

function generateEnemies(ctx, nbEnemies, sprite1, sprite2, sprite3) {
    var i;
    
    if(enemiesArray.length > 0) {
        i = enemiesArray.length;
        nbEnemies += enemiesArray.length;   
    }
    else
        i = 0;
    
    for(i; i < nbEnemies; i++) {
        var x = WORLD_WIDTH + 50;        
        var y = WORLD_GROUND + 50;
        
        var life = 1 + Math.floor(3 * Math.random());
        
        var sprite;
        
        if(life === 1)
            sprite = sprite3;
        else if (life === 2) 
            sprite = sprite2;
        else 
            sprite = sprite1;
        
        var enemy = new Ennemy(x, y,
                              (2 * Math.PI),
                              100,
                              30,
                              "red",
                              life, sprite);
        
        enemiesArray.push(enemy);
    }
}

function updateEnemies(ctx, delta, frameCpt) {
    for(var i = 0; i < enemiesArray.length; i++) {
        var enemy = enemiesArray[i];
        
        var frameX = Math.floor(frameCpt / ANIMATION_DURATION  % 4);
        var frameY = 0;
                
        enemy.move(delta, frameX, frameY);  
    }
}

function drawBonus(ctx, sprite, frameCpt) {
    ctx.save();
    
    for(var i = 0; i < bonusArray.length; i++) {
        bonusArray[i].draw(ctx, sprite);
    }
    
    ctx.restore(); 
}

function Bonus(x0, y0) {
    var x = x0, y = y0;
    
    function draw(ctx, sprite_bonus) {
        ctx.drawImage(sprite_bonus,
             0, 0,
             95, 95,
             x, y - 150 ,
             95, 95);
    }
    
    function getPos() {
        return {x, y};
    }
    
    return {
        draw: draw,
        getPos: getPos
    };
}