// ==UserScript==
// @name        KapScript v0.1
// @namespace   KAPSCRIPT
// @description webMud Script - http://www.webmud.com - https://github.com/strantheman/kapscript
// @version      0.1
// @author       Kap
// @match        http://www.webmud.com/Characters/*
// @grant       none
// ==/UserScript==

// KapScript Initially Created 12/16/2015
// May take inspiration from Blorgen, Chupon. At present no code taken directly from their projects.
// Blorgen - https://github.com/flareofghast/webMUD
// props to Cabal who gave me my first script ever in qmodem pro
//

//#TODO add spell support
// 12/19 10:39:05 AM from Force
// - {caster} raises a hand and utters a harsh word.
// - Ethereal daggers speed forth and shred {target} for {value} damage!
// - You cast heal major wounds on {target}, healing {value} damage!
// - {caster} casts cause harm on {target} for {value} damage!

//#TODO init command to check st to get max health and mana
// TEST: script should never think its base health or base mana is -999

//#TODO setup profiles so rest/run settings are different per character

//#TODO pathing system to move through a list of directions separated by commas
// - option to reverse in real time to back-out
// - http://forums.webmud.com/thread/deepwood-maps/

//#TODO POC for a database - mongo? stored remotely?

//#TODO move() should display the direction command being used, not hide it. use sendMessageText.
// - this function will clear the #message input box, so we should make sure values that were there are replaced after executing

//#TODO sendMessageText() may need to be overridden or extended to allow it to smartly save and then replace what was in #message if its being executed from a script and not a person

//#TODO numpad to send direction commands
//#TODO detect a realm update and refresh the page. possibly wait for dom update to not come back for 2 minutes and then refresh

//#TODO check room (send return) every 4 seconds

//#TODO setup aliases for common commands like wea = eq, bu = buy, use = read, sp = spells

//#TODO fix focus in message box whenever window is activated

//#TODO respond to a telepath from a 'friend' - /kap kapscript version - reseponse: /you KapScript v0.1
//var KAPSCRIPT = KAPSCRIPT || {};

//#TODO handle death = -15

(function($) {


    var AUTO = false;

	console.log = function() {} // disables logging
    var settings = {
        health_rest: 0.90
        ,  health_run: 0.49
    };
    var s = settings;

    var character = {
        base: {
            health: maxHP
            ,   mana: maxMA
        },
        current: {
            health: curHP
            ,   mana: curMA
        },
        get health_percent() {
            return round(c.current.health/this.base.health,2);
        },
        get mana_percent() {
            return round(c.current.mana/this.base.mana,2);
        },
        combat: {
			command: 'attack'
			,	engage: ''
			,	round: 'You hit %mob for %dmg!' //#ff5555
			,	miss: 'You swing at kobold thief!' //#00aaaa
		},
		spell: {
			command: 'vtho'
			,	engage: 'You move to cast volley of thorns upon mud slime!' //996600
			,	round: 'You launch a volley of thorns at giant rat for 9 damage!' //#ff5555
			,	miss: 'You attempt to cast volley of thorns, but fail.' //#00aaaa
			,	mana: -1
		}
    };
    var c = character;

	// when combat starts with (AI), if i have enough mana to cast spell once, cast on active mob


	var model = {
		actionData: {
			Result: 1
			,	TargetID: 'unique'
			,	TargetName: 'mud slime'
		}
	};

	// COMBAT OVERRIDE
	var wm_attack = window.attack;
	window.attack = function(actionData) {
		console.log(actionData);
		sendMessageText(c.spell.command + ' ' + actionData.TargetName);
		wm_attack(actionData);
	/*
		if (actionData.Result == -1) {
			commandHadNoEffect();
			return;
		}
		if (actionData.Result == -2) {
			var text = buildSpan(cga_light_red, "PvP is disabled in this realm.") + "<br>";
			addMessageRaw(text, false, true);
			return;
		}
		console.log('Kaps combat now!');
		var text = buildSpan(cga_dark_yellowHex, "*Combat Engaged**Kap**") + "<br>";
		//todo: show current target somewhere on screen
		addMessageRaw(text, false, true);
		*/
	}

/*
#00aaaa
You hit kobold thief for 6!,

<span class="hour" style="color:#aaaaaa">vtho slime</span>
<br>
<span class="hour23" style="color:#996600">You move to cast volley of thorns upon mud slime!</span>
<br>
<span class="hour23" style="color:#996600">*Combat Engaged*</span>
<br>
<span class="hour23" style="color:#00aaaa">You attempt to cast volley of thorns, but fail.</span>
<br>
<span style="color:#ff5555" class="hour0">You launch a volley of thorns at giant rat for 9 damage!</span>
<br>
<span class="hour23" style="color:#aaaaaa">The mud slime melts into a puddle of goo.</span>
<br>
<span class="hour23" style="color:#aaaaaa">1 copper farthing drops to the ground.</span>
<br>
<span class="hour23" style="color:#aaaaaa">You gain 6 experience.</span>
<br>
<span class="hour23" style="color:#996600">*Combat Off*</span>
<br>
*/

	window.setCurrentHealthAndMana = function() {
        c.current.health = curHP;
        c.current.mana = curMA;
        //return 'Cur HP:' + c.current.health + ' Cur MP:' + c.current.mana + '\nHP %:' + c.health_percent + ' MP %:' + c.mana_percent;
        return c.current;
    }

    window.setStats = function() {
        while(c.base.health <= 0) { // depends on WebMUD.js values being established and for some reason these are sometimes null when first called. while loop doesnt appear to take any longer so it must be a matter of ms
			c.base.health = maxHP;
			c.base.mana = maxMA;
		}
		//return 'Max HP:' + c.base.health + ' Max MP:' + c.base.mana;
		return c.base;
		/*
		function updateHPMA(actionData) {
			maxHP = actionData.MaxHP;
			curHP = actionData.HP;
			maxMA = actionData.MaxMA;
			curMA = actionData.MA;
			resting = actionData.Resting;
			showPrompt(true);
			updateHPMABars();
		};
		*/
	}

    function initkap() { //run once when script enabled
        AUTO = true;
        token = $('#connectionToken').val();
        console.log('KapScript Initialized. Token: ' + token);
        if(token !== '') { sendMessageDirect('st'); }

        // additional startup functions here
        console.log('######### initkap #########');

		result = setStats();
		//console.log('Max HP:' + result.health + ' Max MP:' + result.mana);

        result = setCurrentHealthAndMana();
        //console.log(result);


    }
    function deinitkap() {
        AUTO = false;
        token = $('#connectionToken').val();
        console.log('KapScript Deinitialized. Token: ' + token);

    }

	// ACTIONS
	/*
	function addMessageRaw(message, crlf, removeLastPrompt) {
		if (message != null && message != '') {

			// Add the message to the page.
			$('#mainScreen').append(message);
		}
		if (crlf == true) {
			$('#mainScreen').append("<br/>");
		}
		showPrompt(removeLastPrompt);
		checkOld();
	}

	window.move = move;
	function move(direction) {
		sendMessageText(direction);
	}

function combatOff() {
    var text = buildSpan(cga_dark_yellowHex, "*Combat Off*") + "<br>";
    addMessageRaw(text, false, true);
}

function breakCombat(actionData) {
    if (actionData.BreakFigureID == playerID) {
        combatOff();
    } else {
        var text = buildSpan(cga_dark_yellowHex, actionData.BreakFigureName + " breaks off combat.") + "<br>";
        addMessageRaw(text, false, true);
    }
}
	*/

    var didrun = false;
    window.run = run;
    function run() {
        if(didrun === false) {
            didrun = true; //TODO set the room location that you moved to and allow health to be checked then movement resumed
            //console.log(loc.room.name);

            //sendMessageDirect('u');
            sendMessageDirect('break');
            //move('w');
            move('u');

            //loc.room = loc.room.exits.u;
            //console.log(loc.room.name);
            sendMessageText('rest');
        }
    }
    window.go = go;
    function go() {
        didrun = false;
        move('d');
        //move('e');

    }


	// OBSERVERS
    // add interface with checkbox
    //$('#divMainPanel div:first').width('50%');
 	$('\
    	<input type="checkbox" id="chkEnableKapScript"></input><label for="chkEnableKapScript">KapScript</label>\
    	<br>\
    ').insertBefore('#chkEnableAI');
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

	// puts cursor in the message box whenever main mud black screen area is clicked
	$('#mainScreen').click(function() {
		$('#message').focus();
	});

	// puts cursor in the gossip box whenever main conversation screen area is clicked
	$('#divConversations').click(function() {
		$('#txtCommand').focus();
	});
	function round(value, decimals) { //http://www.jacklmoore.com/notes/rounding-in-javascript/
		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}
    ///////


    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            if (MutationObserver) { //if supported by browser
                // define a new observer
                console.log("MutationObserver");
                var obs = new MutationObserver(function(mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                        //console.log( mutations[0].addedNodes[0]);
                        //console.log($(mutations[0].addedNodes[0]).html() );
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {childList:true, subtree:true});
            }
            else if (eventListenerSupported) { //if old school browser - DELETE ME
                console.log("eventListenerSupported");
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
                //obj.addEventListener('DOMSubtreeModified', callback, false);

            }
        }
    })();

    observeDOM(document.getElementById('mainScreen'), function() { // run every time the game sends data - DOM change
        if (AUTO) {
            combat();
            setCurrentHealthAndMana();
            //console.log(didrun + ' health_percent:' + c.health_percent + ' health_rest:' + s.health_rest + ' health_run:' + s.health_run);
            if (didrun == true && c.health_percent >= s.health_rest) {
                go();
            } else if (didrun == false && c.health_percent < s.health_run) {
                run();
            }
        }
    });
})(jQuery);


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
*/

/*
$("#message").bind("keydown", function() {
    if (e.keyCode == 109) {
        $('#message').val("");
        send('d');

    }
});
*/
