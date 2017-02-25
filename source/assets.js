var assetsToLoadURLs = {
    bg_menu: {url: 'assets/img/Background/menu_bg.jpg'},
    bg_menu_item_rules: {url: 'assets/img/Background/Menu_Item/menu_item_rules.png'},
    bg_menu_item_play: {url: 'assets/img/Background/Menu_Item/menu_item_play.png'},
    help: {url: 'assets/img/Background/help.jpg'},
    
    life_sprite: {url: 'assets/img/HUD/life.png'},  
    life_sprite_bis: {url: 'assets/img/HUD/life_bis.png'},
    sprite_ammo: {url: 'assets/img/HUD/ammo.png'},  
    sprite_ammo_bis: {url: 'assets/img/HUD/ammo_bis.png'},
    
    player_spritesheet: {url: 'assets/img/Sprites/trump2.png'},
    enemy1: {url: 'assets/img/Sprites/minion.png'},
    enemy2: {url: 'assets/img/Sprites/minion2.png'},
    enemy3: {url: 'assets/img/Sprites/minion3.png'},
    bonus_ammo: {url: 'assets/img/Sprites/ammo.png'},
    
    bg: {url: 'assets/img/Background/bg0.png'},
    ground: {url: 'assets/img/Sprites/ground.png'}
    
};

/*var assetsToLoadURLs = {
    bg_menu: {url: 'http://img15.hostingpics.net/pics/401459menubg.jpg'},
    bg_menu_item_rules: {url: 'http://img15.hostingpics.net/pics/924546menuitemrules.png'},
    bg_menu_item_play: {url: 'http://img15.hostingpics.net/pics/558821menuitemplay.png'},
    help: {url: 'http://img15.hostingpics.net/pics/957352help.jpg'},
  
    life_sprite: {url: 'http://img15.hostingpics.net/pics/917366life.png'},  
    life_sprite_bis: {url: 'http://img15.hostingpics.net/pics/601708lifebis.png'},
    sprite_ammo: {url: 'http://img15.hostingpics.net/pics/343640ammo.png'},  
    sprite_ammo_bis: {url: 'http://img15.hostingpics.net/pics/413050ammobis.png'},
  
    player_spritesheet: {url: 'http://img15.hostingpics.net/pics/546881trumpsprite.png'},
    enemy1: {url: 'http://img15.hostingpics.net/pics/667582minion.png'},
    enemy2: {url: 'http://img15.hostingpics.net/pics/667582minion.png'},
    enemy3: {url: 'http://img15.hostingpics.net/pics/667582minion.png'},
    bonus_ammo: {url: 'http://img15.hostingpics.net/pics/628436ammo.png'},
  
    bg: {url: 'http://img15.hostingpics.net/pics/653166bg0.png'},
    ground: {url: 'http://img15.hostingpics.net/pics/833397ground.png'}
};*/

function loadAssets(callback) {
    // here we should load the souds, the sprite sheets etc.
    // then at the end call the callback function           
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback);
}

// You do not have to understand in details the next lines of code...
// just use them!

/* ############################
    BUFFER LOADER for loading multiple files asyncrhonously. The callback functions is called when all
    files have been loaded and decoded 
 ############################## */
function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}

function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded, callback) {
    var assetsLoaded = {};
    var loadedAssets = 0;
    var numberOfAssetsToLoad = 0;

    // define ifLoad function
    var ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        console.log("Loaded asset " + loadedAssets);
    };

    // get num of assets to load
    for (var name in assetsToBeLoaded) {
        numberOfAssetsToLoad++;
    }

    console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        var url = assetsToBeLoaded[name].url;
        console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();

            assetsLoaded[name].onload = ifLoad;
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: function () {
                    if (++loadedAssets >= numberOfAssetsToLoad) {
                        callback(assetsLoaded);
                    }
                    console.log("Loaded asset " + loadedAssets);
                }
            }); // End of howler.js callback
        } // if

    } // for
} // function