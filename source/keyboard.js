//Vars for handling inputs
var inputStates = {};

function setKeyboardEventListener(canvas) {
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', function(event){
                //LEFT WITH : LEFT, Q, q
        if (event.keyCode === 37)       
           inputStates.left = true;
        else if (event.keyCode === 81) 
            inputStates.left = true;
        else if (event.keyCode === 113)
            inputStates.left = true;    
        
        //RIGHT WITH : RIGHT, D, d
        else if (event.keyCode === 39) 
           inputStates.right = true;
        else if (event.keyCode === 68) 
           inputStates.right = true;
        else if (event.keyCode === 100) 
           inputStates.right = true;
        
        //DOWN WITH : DOWN, S, s
        else if (event.keyCode === 40)
           inputStates.down = true;
        else if (event.keyCode === 83)
           inputStates.down = true;
        else if (event.keyCode === 115)
           inputStates.down = true;
        
        //ATTACK : A
        else if (event.keyCode === 65)
            inputStates.attack = true;
        
        //SHIFT
        else if (event.keyCode === 16)
            inputStates.shift = true;
        
        //SPACE
        else if (event.keyCode === 32)
           inputStates.space = true;
        
        //UP WITH : UP, Z, z
        else if (event.keyCode === 38)
           inputStates.space = true;
        else if (event.keyCode === 90)
           inputStates.space = true;
        else if (event.keyCode === 122)
           inputStates.space = true;
        
        //ENTER TO RESTART
        else if (event.keyCode === 13) 
            inputStates.restart = true;
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', function(event){
        //LEFT WITH : LEFT, Q, q
        if (event.keyCode === 37)       
           inputStates.left = false;
        else if (event.keyCode === 81) 
            inputStates.left = false;
        else if (event.keyCode === 113)
            inputStates.left = false; 
        
        //RIGHT WITH : RIGHT, D, d
        else if (event.keyCode === 39) 
           inputStates.right = false;
        else if (event.keyCode === 68) 
           inputStates.right = false;
        else if (event.keyCode === 100) 
           inputStates.right = false;
        
        //DOWN WITH : DOWN, S, s
        else if (event.keyCode === 40)
           inputStates.down = false;
        else if (event.keyCode === 83)
           inputStates.down = false;
        else if (event.keyCode === 115)
           inputStates.down = false;
        
        //ATTACK : A
        else if (event.keyCode === 65)
            inputStates.attack = false;
        
        //SHIFT
        else if (event.keyCode === 16)
            inputStates.shift = false;
        
        //SPACE
        else if (event.keyCode === 32)
           inputStates.space = false;   
        
        //UP WITH : UP, Z, z
        else if (event.keyCode === 38)
           inputStates.space = false;
        else if (event.keyCode === 90)
           inputStates.space = false;
        else if (event.keyCode === 122)
           inputStates.space = false;
        
        //ENTER TO RESTART
        else if (event.keyCode === 13) 
            inputStates.restart = false;
        
        //P to pause the  game
        else if (event.keyCode === 80 && !inputStates.pause)
            inputStates.pause = true;
        else if (event.keyCode === 80 && inputStates.pause)
            inputStates.pause = false;
        
        //F1 for help menu
        else if (event.keyCode === 72 && !inputStates.help)
            inputStates.help = true;
        else if (event.keyCode === 72 && inputStates.help)
            inputStates.help = false;
    }, false);      

    // Mouse event listeners
    canvas.addEventListener('mousemove', function (evt) {
        inputStates.mousePos = getMousePos(evt, canvas);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
        inputStates.mousedown = true;
        inputStates.mouseButton = evt.button;
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        inputStates.mousedown = false;
    }, false);  
}

function resetKeyboard() {
    inputStates = [];
}

function getMousePos(evt, canvas) {
    // necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
