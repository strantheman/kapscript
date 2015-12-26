// ==UserScript==
// @name        KapScript Tests
// @namespace   KAPSCRIPT
// @description webMud Script Tests - http://www.webmud.com - https://github.com/strantheman/kapscript
// @version      0.1
// @author       Kap
// @match        http://www.webmud.com/Characters/*
// @grant       none
// ==/UserScript==
//var KAPSCRIPT = KAPSCRIPT || {};
//#TODO maybe a way to loop over all tests - using the subclassed init method register each test in an array
//#TODO count passes and fails and output in console. for now assume no output means no errors

//$('<button id="btnRunKapScriptTests" style="color:#000;">KapScript Tests</button>');
$('#messageContainer').append('<button id="btnRunKapScriptTests" style="color:#000;">KapScript Tests</button>');
$('#btnRunKapScriptTests').click(function() {
	console.log('######### Begin Tests #####');

	// could run these all as a Dwarf Cleric and assume what the HP and MP values will be in order to setup a static test
	//testSetStats.exe();
	testSetCurrentHealthAndMana.exe();
	testSpellIsSet.exe();
	testManaCheckSpellCost.exe();
	testManaCheckManaAttack.exe();

	console.log('######### End Tests #######');
	console.log(Test.observers[0]);
	Test.observers[0].whoami();

});


////////
var Test = {
	init: function(caller) {
		success = false;
		//this.observers.push(caller);

	},
	deinit: function(caller) {
	},
	assert: function(condition, message) {
		if (!condition) {
			message = message || "Assertion failed";
			console.log('assert ' + message);
			throw message; // Fallback
		} else {
			//console.log('condition pass');
		}
	},
	register: function(observer) {
		this.observers.push(observer);
	},
	exe: function() {},
	whoami: function(caller) {
		console.log('I am: ' + caller);
	},
	observers: []

};

////////
var testSetStats = Object.create(Test);
testSetStats.register(this);
testSetStats.exe = function() {
	this.whoami('testSetStats');
	 this.init();
	console.log('testSetStats');
	result = window.setStats();
	//result.health = -1;/////////////////////////////////////////////////////////////////
	this.assert(result.health > 0,"Base health should be greater than 0");
	//#TODO if mana is valid for the char
}


var testSetCurrentHealthAndMana = Object.create(Test);
testSetCurrentHealthAndMana.exe = function() {
	this.init();
	result = window.setCurrentHealthAndMana();
	this.assert(result.health > 0 && result.mana > 0,"Current health and mana should be greater than 0"); // make sure to test against a mana user
}

// mana check should make sure you have enough mana to cast the spell, and that youre not below your mana_attack min
var testSpellIsSet = Object.create(Test);
testSpellIsSet.exe = function() {
	this.init();
	window.setStats();
	window.setCurrentHealthAndMana();
	c = getCharacter();
	s = getSettings();
	this.assert(c.spell.command !== '',"Character spell value should be set");
}

var testManaCheckSpellCost = Object.create(Test);
testManaCheckSpellCost.exe = function() {
	this.init();
	window.setStats();
	window.setCurrentHealthAndMana();
	c = getCharacter();
	s = getSettings();

	c.current.mana = 10;
	c.spell.mana = 10; //11 should fail and 10 should pass
	s.mana_attack = 9;
	result = window.mana_check();
	this.assert(result == true,"Character should have enough mana to cast the spell");

}

var testManaCheckManaAttack = Object.create(Test);
testManaCheckManaAttack.exe = function() {
	this.init();
	window.setStats();
	window.setCurrentHealthAndMana();
	c = getCharacter();
	s = getSettings();

	c.current.mana = 10;
	c.spell.mana = 10; //11 should fail and 10 should pass
	s.mana_attack = 9; //10 should fail 9 should pass
	result = window.mana_check();
	this.assert(result == true,"Character should not be able to cast if mana is less than the mana_attack setting");

}

/*
////////
var Rectangle = {
	create: function(width, height) {

		var newObj = Object.create(this); // create a new object based on itself
		newObj.width = width;
		newObj.height = height;

		return newObj;
	},
	area: function() {
		return this.width * this.height;
	}
};
var rect1 = Rectangle.create(10, 5);
console.log(rect1.area());

var Square = Object.create(Rectangle); // 'extend' Rectangle
Square.create = function(side) {
	// take the create function of Rectangle, or do something totally different
	return Rectangle.create(side, side);
}
var sq = Square.create(10);
console.log(sq.area());


// expect to see 2 lines  PASS
// 50
// 100
*/