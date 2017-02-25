var menuMessages = ["Jouer", "Scores", "Touches", "Crédits"], 
    gameoverMessages = [" - GAME OVER - ", "APPUYER SUR ENTRER POUR REJOUER"],
    pauseMessages = [" - PAUSE - ", "APPUYER SUR P POUR REPRENDRE"],
    helpMessages = ["- MENU AIDE -", "Touches de jeux : ", "Flèches pour diriger ou ZQSD", "A pour Attaquer", "P pour mettre en pause", "ESPACE pour sauter", "SHIFT pour accélerer"];
      
// Game Framework starts here
var GF = function () {    
    //Vars relative to the canvas
    var canvas, ctx, w, h, spritesheet, trump;
    
    // Vars for counting frames/s, used by the measureFPS function
    var frameCount = 0,
        lastTime,
        fpsContainer,
        fps,
        totalTime = 0;
    
    //Stockage des assets du jeu
    var assets = {};
    
    //For time based animation
    var delta, oldTime = 0;
    
    //Player, world and the enemies
    var player = new Player(),
        world  = new World();
    
    //Etat du jeu
    var gameStates = {
            menu: 0,
            gameRunning: 1,
            gameOver: 2,
            gamePaused: 3,
            help: 4
        };
    
    var currentGameState = gameStates.menu;
    
    var measureFPS = function (newTime) {
        if (lastTime === undefined) {
            lastTime = newTime;
            return;
        }
        
        //Calculate the difference between last & current frame
        var diffTime = newTime - lastTime;
        
        if(diffTime >= 1000){
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }
        
        //And display it in an element we appended to the doc in the start() fct
        fpsContainer.innerHTML = 'FPS: ' + fps;
        frameCount++;
    };
    
    //Clears the canvas content
    function clearCanvas () {
        ctx.clearRect(0, 0, w, h);
    }
    
    function timer(currentTime){
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        
        return delta;
    }
    
    function allAssetsLoaded(assetsLoaded) {
        console.log("all samples loaded and decoded");
        for (var asset in assetsLoaded) {
            //console.log("assets[" + asset + "] = " + assetsLoaded[asset]);
            assets[asset] = assetsLoaded[asset];
        }
    }
    
    var mainLoop = function (time) {
        clearCanvas();
        measureFPS(time);

        //Check inputs and move the player        
        delta = timer(time);
        
        //Draw the world
        world.draw(ctx, assets.bg, assets.ground);
                      
        for(var i = 0; i < enemiesArray.length; i++)
            enemiesArray[i].draw(ctx);
        
        //Draw the player sprite 
        player.draw(ctx, assets.player_spritesheet, assets.life_sprite, assets.life_sprite_bis, assets.sprite_ammo, assets.sprite_ammo_bis, assets.sprite_ammo);
                
        if(inputStates.pause)
            currentGameState = gameStates.gamePaused;
        else if(inputStates.help)
            currentGameState = gameStates.help;
        
        switch(currentGameState) {
            case gameStates.menu:                
                ctx.drawImage(assets.bg_menu,
                 0, 0, // Image source --> Origine X et Origine Y à partir desquelles on dessinera l'image source
                 1600, 800, // Taille de l'image à dessiner --> Largeur, Hauteur
                 0, 0, // Image destination --> Origine X et Origine Y où sera dessiné l'image source
                 1600 * GAME_SCALE / 1.2, 800 * GAME_SCALE / 1.2);  // Echelle de l'image à dessiner            
                
                //ctx.drawImage(assets.bg_menu, 0, 0);
                ctx.drawImage(assets.bg_menu_item_play, 
                              0, 0,
                              183, 70,
                              0.8 * WORLD_WIDTH / 4, 125,
                              183 * GAME_SCALE, 70 * GAME_SCALE);
                
                ctx.drawImage(assets.bg_menu_item_rules, 
                              0, 0,
                              220, 70,
                              2.5 * WORLD_WIDTH / 4, 125,                             
                              220 * GAME_SCALE, 70 * GAME_SCALE);
                
                if(inputStates.mousedown){
                    if(inputStates.mousePos.x >= 0.8 * WORLD_WIDTH / 4 && inputStates.mousePos.x <= 0.8 * WORLD_WIDTH / 4 + 183
                        && inputStates.mousePos.y >= 125 && inputStates.mousePos.y <= 125 + 70)
                        currentGameState = gameStates.gameRunning;

                    if(inputStates.mousePos.x >= 2.5 * WORLD_WIDTH / 4 && inputStates.mousePos.x <= 2.5 * WORLD_WIDTH / 4 + 220
                        && inputStates.mousePos.y >= 125 && inputStates.mousePos.y <= 125 + 70) {
                        inputStates.help = true;
                    }
                }
                                
                break;                
            case gameStates.gameRunning:     
                if(FrameCpt % Math.floor(Math.random() * 700) === 0 && enemiesArray.length <= maxEnemy) {
                    generateEnemies(ctx, 1, assets.enemy1, assets.enemy2, assets.enemy3);
                }

                FrameCpt++;
                
                updateEnemies(ctx, delta, FrameCpt); 
                drawBonus(ctx, assets.bonus_ammo, FrameCpt);

                player.updatePosition(ctx, delta, assets.sprite_ammo, assets.bonus_ammo);
                
                if(player.hud.getInfo().life === 0)  {                    
                    currentGameState = gameStates.gameOver;
                }
                
                break;                
            case gameStates.gameOver:       
                // En cas de 'Game Over' --> on attend que le joueur appuie sur une touche pour continuer
                drawMessage(true, true, gameoverMessages);
                
                if(inputStates.restart)
                    resetGame();
                
                break;                
            case gameStates.gamePaused:
                // En cas de 'Pause' --> on attend que le joueur appuie sur une touche pour continuer
                drawMessage(true, true, pauseMessages);
                
                if(!inputStates.pause) 
                    currentGameState = gameStates.gameRunning;
                
                break;
            case gameStates.help:
                //drawMessage(true, true, helpMessages);
                ctx.drawImage(assets.help,
                             0, 0,
                             1200, 675,
                             0, 0,
                             1300 * GAME_SCALE, 775 * GAME_SCALE);
                
                if(!inputStates.help)
                    currentGameState = gameStates.gameRunning;
                
                break;
        }        
        
        requestAnimationFrame(mainLoop); 
    };
    
    var resetGame = function() {        
        player = new Player();
        world = new World();
        enemiesArray = [];
        bonusArray = [];   
        
        currentGameState = gameStates.gameRunning;
        
        resetKeyboard();
    };
    
    var drawMessage = function(overscreen, centered, messages) {
        ctx.save();
        
        if(overscreen) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        }
           
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white"
        ctx.font = "bold 50px Georgia";
        ctx.textAlign = "center";   
        ctx.globalAlpha = 1;
            
        if(centered)           
            var x = WORLD_WIDTH / 2;
        else
            var x = WORLD_WIDTH / 4;
        
        for(var i = 0; i < messages.length; i++) {            
            var y = WORLD_HEIGHT / 3 + (i * 80);
            
            ctx.fillText(messages[i], x, y);            
            ctx.strokeText(messages[i], x, y);
        }
        
        ctx.restore();
    };
    
    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
      
        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");
  
        canvas.width = window.innerWidth - 100;
        canvas.height = window.innerHeight - 50;
        
        // often useful
        w = canvas.width; 
        h = canvas.height;
        
        WORLD_WIDTH = w;
        WORLD_HEIGHT = h;
                
        if(w < 800) {
            GAME_SCALE = 0.5;
            WORLD_GROUND = 600;
        }
        else if(w < 1000) {
            GAME_SCALE = 0.8;
            WORLD_GROUND = 620;
        }
        else if(w < 1200) { 
            GAME_SCALE = 1;
            WORLD_GROUND = 640;
        }
        else {
            GAME_SCALE = 1.4;
            WORLD_GROUND = 660;
        }
  
        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text
        ctx.font = "20px Georgia";
        
        ctx.fillStyle = "black";
        ctx.strokeStyle = "red";
      
        setKeyboardEventListener(canvas);
        
        // start the animation
        loadAssets(function(assets) {  
            allAssetsLoaded(assets);
            requestAnimationFrame(mainLoop);
        });
    };

    //Our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

window.onload = function init () {
    var game = new GF();
    
    game.start();
};