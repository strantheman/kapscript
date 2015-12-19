// ==UserScript==
// @name        KapScript v0.1
// @namespace   kapscript
// @description webMud Script - http://www.webmud.com
// @version      0.1
// @author       Kap
// @match        http://www.webmud.com/Characters/Game*
// @grant       none
// ==/UserScript==

// reference - and make sure to credit if you learn anything or borrow anything
// https://github.com/flareofghast/webMUD
// props to Cabal who gave me the first script ever in qmodem pro
//
//(function() {
    var AUTO = false;

    var settings = {
        health_rest: 0.90
        ,  health_run: 0.69
    };
    var s = settings;

    var character = {
        base: {
            health: 27
            ,   mana: 0
        },
        current: {
            health: curHP
            ,   mana: 999
        },
        get health_percent() {
            return c.current.health/this.base.health;
        }
    };
    var c = character;

    function setCurrentHealth() {
        c.current.health = curHP;
        console.log(c.current.health + ' ' + c.health_percent*100 + '%');
    }


    function initkap() {
        AUTO = true;
        token = $('#connectionToken').val();
        console.log('KapScript Initialized. Token: ' + token);
        if(token !== '') { sendMessageDirect('st'); }

        // additional startup functions here
        setCurrentHealth();
        console.log('Init health: ' + c.current.health);
    }
    function deinitkap() {
        AUTO = false;
        token = $('#connectionToken').val();
        console.log('KapScript Deinitialized. Token: ' + token);

    }


    // add interface with checkbox
    //$('#divMainPanel div:first').width('50%');
    $('<input type="checkbox" id="chkEnableKapScript"></input><label for="chkEnableKapScript">KapScript</label>').insertBefore('#chkEnableAI');
    if($('#chkEnableKapScript').checked) {
        initkap();
    }
    $('#chkEnableKapScript').change(function() {
       if ($(this).is(':checked')) {
          initkap();
       } else {
          deinitkap();
       }
    });


    var didrun = false;
     window.run = run;
    function run() {
        if(didrun === false) {
            didrun = true; //TODO set the room location that you moved to and allow health to be checked then movement resumed
            //console.log(loc.room.name);
            sendMessageDirect('u');
            //loc.room = loc.room.exits.u;
            //console.log(loc.room.name);
            sendMessageDirect('rest');
        }
    }
    window.go = go;
    function go() {
        didrun = false;
        sendMessageDirect('d');
    }

    ///////


    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){ //if supported by browser
                // define a new observer
                console.log("MutationObserver");
                var obs = new MutationObserver(function(mutations, observer){
                    if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        //console.log( mutations[0].addedNodes[0]);
                        //console.log($(mutations[0].addedNodes[0]).html() );
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { childList:true, subtree:true });
            }
            else if( eventListenerSupported ){ //if old school browser - DELETE ME
                console.log("eventListenerSupported");
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
                //obj.addEventListener('DOMSubtreeModified', callback, false);

            }
        }
    })();

    observeDOM( document.getElementById('mainScreen') ,function(){
        if (AUTO) {
            setCurrentHealth();
            //console.log('# DOM change detected');
            //TODO set c.current.health = curHP at all times.
            console.log(didrun + ' health_percent:' + c.health_percent + ' health_rest:' + s.health_rest + ' health_run:' + s.health_run);
            if (didrun == true && c.health_percent >= s.health_rest) {
                go();
            } else if (didrun == false && c.health_percent < s.health_run) {
                run();
            }
        }


    });

    ///////


//});



//("DisableAI");
//("EnableAI");



/*

var map = {
    room1: {
       name: 'Deepwood Arena',
       exits: {
          d: room2
       }
    },
    room2: {
       name: 'Fighting Pit'
       exits: {
          u: room1
       }
    }
};
console.log('room name ' + map.room1.name);


var location = {
    get room() {
       return map.room1; //default room
    }
};
var loc = location;

room = loc.room;
console.log(room.name);






function checkHealth() {
    console.log('h ' + c.health_percent);
    if(c.health_percent < s.health_run) {
        //move.s();
        //send('u');
        run();


    }
}





function waitForJQuery() {
    if(!window['jQuery']) {
        setTimeout(waitForJQuery, 500);
    }
    else {
        //main(); // run something now that the doc is loaded

        sendMessageDirect("-");

    }
}

window.addEventListener('load', waitForJQuery);
*/

/*
var o = {
  a: 7,
  get b() {
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2
  }
};

console.log(o.a); // 7
console.log(o.b); // 8
o.c = 50;
console.log(o.a); // 25
*/


/*
$("#message").bind("keydown", function() {
    if (e.keyCode == 109) {
        $('#message').val("");
        send('d');

    }
});
*/
