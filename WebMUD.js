var cga_blackHex = '#000000';       //0
var cga_whiteHex = '#ffffff';       //15
var cga_light_grayHex = '#aaaaaa';  //7
var cga_dark_grayHex = '#555555';   //8
var cga_yellowHex = '#FFFF00';      //14
var cga_dark_yellowHex = '#996600'; //6
var cga_light_red = '#ff5555';      //12
var cga_dark_red = '#aa0000';       //4
var cga_light_green = '#55ff55';    //10
var cga_dark_green = '#00aa00';     //2
var cga_light_cyan = '#55ffff';     //11
var cga_dark_cyan = '#00aaaa';      //3
var cga_light_blue = '#5555ff';     //9
var cga_dark_blue = '#0000aa';      //1
var cga_light_magenta = '#ff55ff';  //13
var cga_dark_magenta = '#aa00aa';   //5

var northInt = 0;
var southInt = 1;
var eastInt = 2;
var westInt = 3;
var northeastInt = 4;
var northwestInt = 5;
var southeastInt = 6;
var southwestInt = 7;
var upInt = 8;
var downInt = 9;

var curHP = 0;
var curMA = 0;
var maxHP = 0;
var maxMA = 0;
var resting = false;

var hub;

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function updateHPMABars() {
    var hpPercent = Math.round(curHP * 100 / maxHP);

    $("#hp").html(String(hpPercent) + "%");
    if (maxMA > 0) {
        var maPercent = Math.round(curMA * 100 / maxMA);
        $("#ma").html(String(maPercent) + "%");
    } else {
        $("#maContainer").hide();
    }
    $('.vertical .progress-fill span').each(function () {
        var percent = $(this).html();
        var pTop = 100 - (percent.slice(0, percent.length - 1)) + "%";
        $(this).parent().css({
            'height': percent,
            'top': pTop
        });
    });
}

var nextClearHour = new Date().getHours();

function checkOld() {
    var curDate = new Date();
    var curHour = curDate.getHours();
    if (curHour > nextClearHour || (nextClearHour == 23 && curHour == 0)) {
        $('.hour' + String(nextClearHour)).remove();
        nextClearHour = curHour;
    }
}

function addMessage(message, hexColor, crlf, removeLastPrompt) {
    if (message != null && message != '') {
        
        // Add the message to the page.
        $('#mainScreen').append('<span style="color:' + hexColor + '" class="hour">' + message + '</span>');
    }
    if (crlf == true) {
        $('#mainScreen').append("<br/>");
    }
    showPrompt(removeLastPrompt);
    checkOld();
}

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

function sendMessage() {
    
    // Call the Send method on the hub.
    var textToSend = $('#message').val();
    
    addMessage(textToSend, cga_light_grayHex, true, false);
    sendMessageDirect(textToSend);
    // Clear text box and reset focus for next comment.
    $('#message').val('').focus();
}

function sendMessageText(messageText) {
    addMessage(messageText, cga_light_grayHex, true, false);
    sendMessageDirect(messageText);
}

function sendMessageDirect(messageText) {
    var connectionToken = $('#connectionToken').val();
    hub.server.sendTextToServer(connectionToken, messageText).done(function (result) {
        //addMessage(result);
    });
}

function colorToHex(color) {
    switch (color) {
        case 0: //$cga_black
            return cga_blackHex;
        case 15: //$cga_white
            return cga_whiteHex;
        case 7: //$cga_light_gray: 
            return cga_light_grayHex;
        case 8: //$cga_dark_gray
            return cga_dark_grayHex;
        case 14: //$cga_yellow
            return cga_yellowHex;
        case 6: //$cga_darkyellow (brown)
            return cga_dark_yellowHex;
        case 12: //$cga_light_red
            return cga_light_red;
        case 4: //$cga_dark_red:
            return cga_dark_red;
        case 10: //$cga_light_green
            return cga_light_green;
        case 2: //$cga_dark_green
            return cga_dark_green;
        case 11: //$cga_light_cyan
            return cga_light_cyan;
        case 3: //$cga_dark_cyan
            return cga_dark_cyan;
        case 9: //$cga_light_blue
            return cga_light_blue;
        case 1: //$cga_dark_blue
            return cga_dark_blue;
        case 13: //$cga_light_magenta
            return cga_light_magenta;
        case 5: //$cga_dark_magenta
            return cga_dark_magenta;
        default:
            return cga_light_grayHex;
    }
}

function fromExitDirectionName(exitDirectionID) {
    switch (exitDirectionID) {
        case 0: 
            return "the north";
        case 1:
            return "the south";
        case 2:
            return "the east";
        case 3:
            return "the west";
        case 4:
            return "the northeast";
        case 5:
            return "the northwest";
        case 6:
            return "the southeast";
        case 7:
            return "the southwest";
        case 8:
            return "above";
        case 9:
            return "below";
        case 10:
        default:
            return "nowhere";
    }
}

function toExitDirectionName(exitDirectionID) {
    switch (exitDirectionID) {
        case 0:
            return "to the north";
        case 1:
            return "to the south";
        case 2:
            return "to the east";
        case 3:
            return "to the west";
        case 4:
            return "to the northeast";
        case 5:
            return "to the northwest";
        case 6:
            return "to the southeast";
        case 7:
            return "to the southwest";
        case 8:
            return "upwards";
        case 9:
            return "downwards";
        case 10:
        default:
            return "to nowhere";
    }
}

function getWornLocationName(wornLocationID) {
    switch (wornLocationID) {
        case 1:
            return "Head";
        case 2:
            return "Torso";
        case 3:
            return "Hands";
        case 4:
            return "Arms";
        case 5:
            return "Legs";
        case 6:
            return "Feet";
        case 7:
            return "Back";
        case 8:
            return "Neck";
        case 9:
            return "Weapon Hand";
        case 10:
            return "Off-Hand";
        case 11:
            return "Finger";
        case 12:
            return "Ears";
        case 13:
            return "Eyes";
        case 14:
            return "Wrist";
        case 15:
            return "Waist";
        default:
            return "Unknown";
    }
}

function genderName(genderID) {
    switch (genderID) {
        case 0:
            return "He";
        case 1:
            return "She";
        case 2:
        default:
            return "It";
    }
}

function buildSpan(color, text) {
    text = escapeHtml(text);
    var curDate = new Date();
    var hourString = "hour" + String(curDate.getHours());
    return "<span class=\"" + hourString + "\" style=\"color:" + color + "\">" + text + "</span>";
}

function buildFormattedSpan(color, text, desiredLength, leftAligned) {
    var numSpaces = desiredLength - text.length;
    text = escapeHtml(text);
    var curDate = new Date();
    var hourString = "hour" + String(curDate.getHours());
    var formattedText = "<span class=\"" + hourString + "\" style=\"color:" + color + "\">";
    var padding = "";
   
    for (var i = 0; i < numSpaces; i++) {
        padding += "&nbsp;"
    }
    if (leftAligned) {
        formattedText += (text + padding);
    } else {
        formattedText += (padding + text);
    }
    formattedText += "</span>";
    return formattedText;
}

function beMoreSpecificList(list) {
    var text = buildSpan(cga_light_red, "Please be more specific.  You could have meant any of these:") + "<br>";
    for (var i = 0; i < list.length; i++) {
        text += buildSpan(cga_light_grayHex, "-- " + list[i]) + "<br>";
    }
    return text;
}

var playerID;
var conversationsURL = '';
var conversationWindow;

function startConnection() {
    // Start the connection.
    $.connection.hub.start().done(function () {
        //alert('started');
        hub.server.tryConnect(playerID).done(function (result) {
            //alert(result);
            if (result.Success && result.Success == true) {
                $('#connectionToken').val(result.ConnectionToken);
                playerID = result.PlayerID;
                $('#playerID').val(result.PlayerID);
                $('#divLogin').hide();
                $('#mainDisplay').show();
                openConversationsWindow();
                refreshPlayerList();
            } else {
                if (result.InfoMessage != null) {
                    alert(result.InfoMessage);
                } else {
                    alert("Unknown error occurred trying to connect");
                }
            }
        }).fail('Failed to connect to hub!');
    }).fail(function () {
        'Failed to start hub!'
    });
}

function connect(playerID) {
    //debug
    //$.connection.hub.logging = true;
    //alert('connect');
    //$.connection.hub.disconnected(function () {
    //    waitAndReconnect();
    //});
    
    startConnection();
}

function waitAndReconnect() {
    setTimeout(function () {
        startConnection();
    }, 10000);
}

function openConversationsWindow() {
    conversationWindow = window.open(conversationsURL, 'conversation' + playerID, 'width=600, height=750');
    window.onbeforeunload = function (e) {
        conversationWindow.close();
    };
    return false;
}

//function create() {
//    $.connection.hub.start().done(function () {
//        hub.server.tryCreateCharacter($('#txtNewUsername').val(), $('#txtNewPassword').val()).done(function (result) {
//            if (result.Success && result.Success == true) {
//                $('#connectionToken').val(result.ConnectionToken);
//                $('#playerID').val(result.PlayerID);
//                playerID = result.PlayerID;
//                $('#divLogin').hide();
//                $('#mainDisplay').show();
//                refreshPlayerList();
//            } else {
//                if (result.InfoMessage != null) {
//                    alert(result.InfoMessage);
//                } else {
//                    alert("Unknown error occurred trying to create character");
//                }
//            }
//        });
//    });
//}

function refreshPlayerList() {
    hub.server.getPlayersInRealm().done(function (result) {
            
        var items = [];
        $.each(result, function (id, name) {
            items.push('<li class="list-group-item">' + name + '</li>');
        });
        $('#listPlayers').html(items.join(''));
    });
}

function updateHPMA(actionData) {
    maxHP = actionData.MaxHP;
    curHP = actionData.HP;
    maxMA = actionData.MaxMA;
    curMA = actionData.MA;
    resting = actionData.Resting;
    showPrompt(true);
    updateHPMABars();
};

var $lastPrompt;

function showPrompt(removeOldPrompt) {
    //todo: add colors for visual danger/warnings
    var statline = buildSpan(cga_dark_cyan, '[HP=') + buildSpan(cga_light_cyan, String(curHP));
    if (maxMA > 0) {
        statline += buildSpan(cga_dark_cyan, "/MA=") + buildSpan(cga_light_cyan, String(curMA));
    }
    if (resting == false) {
        statline += buildSpan(cga_dark_cyan, "]:");
    } else {
        statline += buildSpan(cga_dark_cyan, "](Resting):")
    }
    
    if ($lastPrompt && removeOldPrompt && removeOldPrompt == true) {
        $lastPrompt.remove();
    }
    $lastPrompt = $('<span />').append(statline);
    $('#mainScreen').append($lastPrompt);
    scrollToBottom();
}

function scrollToBottom() {
    var objDiv = document.getElementById("mainScreen");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function fixStackName(count, name) {
    var result;
    if (count == 1) {
        result = name;
    } else {
        result = String(count) + " " + name;
        if (!name.endsWith('s')) {
            result += "s";
        }
    }
    return result;
}

function getConversationDateString() {
    var curDate = new Date();
    var curDateString = String(curDate.getMonth() + 1) + '/' + curDate.getDate() + ' ' + curDate.toLocaleTimeString();
    return curDateString;
}

function playerGossips(actionData) {
    if (actionData.Result != undefined && actionData.Result == -1) {
        var text = buildSpan(cga_light_red, "*Gossip Censored* - " + actionData.Message);
        addMessageRaw(text, true, true);
        if (conversationWindow != null) {
            conversationWindow.addComm(getConversationDateString(), actionData.Sender, 2, null, actionData.Message, true);
        }
        return;
    }
    var gossipText = buildSpan(cga_light_grayHex, actionData.Sender + " gossips: ") + buildSpan(cga_light_magenta, actionData.Message);
    addMessageRaw(gossipText, true, true);
    if (conversationWindow != null) {
        var dateString = getConversationDateString();
        conversationWindow.addComm(dateString, actionData.Sender, 2, null, actionData.Message);
    }
}

function playerEnters(actionData) {
    var enterText = buildSpan(cga_light_grayHex, actionData.Name + " just entered the Realm.");
    addMessageRaw(enterText, true, true);
    refreshPlayerList();
}

function playerDisconnects(actionData) {
    var enterText = buildSpan(cga_whiteHex, actionData.Name + " just disconnected!!!");
    addMessageRaw(enterText, true, true);
    refreshPlayerList();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function singleCoinName(coinTypeID) {
    switch (coinTypeID) {
        case 1:
            return "copper farthing";
        case 2:
            return "silver noble";
        case 3:
            return "gold crown";
        case 4:
            return "platinum piece";
        case 5:
            return "runic coin";
    }
}

function pluralCoinName(coinTypeID) {
    switch (coinTypeID) {
        case 1:
            return "copper farthings";
        case 2:
            return "silver nobles";
        case 3:
            return "gold crowns";
        case 4:
            return "platinum pieces";
        case 5:
            return "runic coins";
    }
}

function showRoom(actionData) {
    var mainText = buildSpan(cga_light_cyan, actionData.Name) + "<br>";
    mainText +=  "&nbsp;&nbsp;&nbsp;&nbsp;" + buildSpan(cga_light_grayHex, actionData.Description) + "<br>";
    var items = "";
    if (actionData.VisibleCoinRolls && actionData.VisibleCoinRolls.length > 0) {
        for (var i = 0; i < actionData.VisibleCoinRolls.length; i++) {
            if (actionData.VisibleCoinRolls[i].Count > 0) {
                if (items != "") {
                    items += ", ";
                }
                items += String(actionData.VisibleCoinRolls[i].Count) + " ";
                if (actionData.VisibleCoinRolls[i].Count > 1) {
                    items += pluralCoinName(actionData.VisibleCoinRolls[i].CoinTypeID);
                } else {
                    items += singleCoinName(actionData.VisibleCoinRolls[i].CoinTypeID);
                }
            }
        }
    }
    if (actionData.VisibleItems && actionData.VisibleItems.length > 0) {
        
        for (var i = 0; i < actionData.VisibleItems.length; i++) {
            if (items != "") {
                items += ", ";
            }
            items += fixStackName(actionData.VisibleItems[i].Count, actionData.VisibleItems[i].Name);
        }
        
    }
    if (items != "") {
        var youNoticeText = "You notice " + items + " here.";
        mainText += buildSpan(cga_dark_cyan, youNoticeText) + "<br>";
    }
    if (actionData.AlsoHerePlayers.length > 0 || actionData.AlsoHereMobs.length > 0) {
        var alsoHereText = "Also here: ";
        var first = true;
        for (var i = 0; i < actionData.AlsoHerePlayers.length; i++) {
            if (i > 0) {
                alsoHereText += ", ";
            }
            alsoHereText += actionData.AlsoHerePlayers[i].FirstName;
            first = false;
        }
        for (var i = 0; i < actionData.AlsoHereMobs.length; i++) {
            if (i > 0 || !first) {
                alsoHereText += ", ";
            }
            alsoHereText += actionData.AlsoHereMobs[i].Name;
        }
        alsoHereText += ".";
        mainText += buildSpan(cga_light_magenta, alsoHereText) + "<br>";
    }
    var obviousExits = "Obvious exits: ";
    if (actionData.ObviousExits && actionData.ObviousExits.length > 0) {
        for (var i = 0; i < actionData.ObviousExits.length; i++) {
            if (i > 0) {
                obviousExits += ", ";
            }
            obviousExits += actionData.ObviousExits[i];
        }
    } else {
        obviousExits += "None!";
    }
    mainText += buildSpan(cga_dark_green, obviousExits) + "<br>";
    addMessageRaw(mainText, false, true);
}

function playerSaysInRoom(actionData) {
    var sayWord;
    if (actionData.SayingPlayer != "You") {
        sayWord = "says";
    } else {
        sayWord = "say";
    }
    var sayText = buildSpan(cga_dark_green, actionData.SayingPlayer + " " + sayWord + " \"" + actionData.SayText + "\"") + "<br>";
    addMessageRaw(sayText, false, true);
    if (conversationWindow != null) {
        var dateString = getConversationDateString();
        conversationWindow.addComm(dateString, actionData.SayingPlayer, 1, null, actionData.SayText);
    }
}

function genericText(actionData) {
    var hexColor = colorToHex(actionData.Color);
    var text = buildSpan(hexColor, actionData.Text) + "<br>";
    addMessageRaw(text, false, true);
}

function entersTheRoom(actionData) {
    var enterText;
    if (actionData.EnteringFigureType == 0) {
        enterText = "<span style='background-color:" + cga_light_grayHex + ";color:black'>" + actionData.EnteringFigureName + " walks into the room from " + fromExitDirectionName(actionData.FromDirection) + ".</span><br>";
    } else {
        enterText = buildSpan(cga_yellowHex, "A " + actionData.EnteringFigureName);
        enterText += buildSpan(cga_dark_green, " " + actionData.EntranceMessage.replace("{exitDirection}", fromExitDirectionName(actionData.FromDirection))) + "<br>";
    }
    addMessageRaw(enterText, false, true);
    
}

function runsIntoWall(actionData) {
    var runsIntoWallText = buildSpan(cga_whiteHex, actionData.Player + " runs into the wall " + toExitDirectionName(actionData.Direction) + ".") + "<br>";
    addMessageRaw(runsIntoWallText, false, true);
}

function leavesTheRoom(actionData) {
    var enterText;
    if (actionData.LeavingFigureType == 0) {
        enterText = "<span style='background-color:" + cga_light_grayHex + ";color:black'>" + actionData.LeavingFigureName + " just left " + toExitDirectionName(actionData.LeavingDirection) + ".</span><br>";
    } else {
        enterText = buildSpan(cga_yellowHex, actionData.LeavingFigureName);
        enterText += buildSpan(cga_dark_green, " " + actionData.LeavingMessage.replace("{exitDirection}", toExitDirectionName(actionData.LeavingDirection))) + "<br>";
    }
    
    addMessageRaw(enterText, false, true);
}

function lookingToDirection(actionData) {
    var text = buildSpan(cga_light_grayHex, actionData.Player + " is looking " + toExitDirectionName(actionData.LookDirection) + ".") + "<br>";
    addMessageRaw(text, false, true);
}

function peekingFromDirection(actionData) {
    var text = buildSpan(cga_dark_magenta, actionData.Player + " peeks in from " + fromExitDirectionName(actionData.FromDirection) + "!") + "<br>";
    addMessageRaw(text, false, true);
}

function lookingAroundRoom(actionData) {
    var text = buildSpan(cga_light_grayHex, actionData.Player + " is looking around the room.") + "<br>";
    addMessageRaw(text, false, true);
}

function lookingAtSomething(actionData) {
    switch (actionData.Result) {
        case 0: //SuccessPlayer
            if (actionData.TargetPlayerID != playerID || actionData.LookingAtSelf == true) {
                var text = buildSpan(cga_light_cyan, "[ " + actionData.TargetFullName + " ]") + "<br>";
                text += buildSpan(cga_light_grayHex, actionData.TargetDescription) + "<br><br>";
                if (actionData.TargetGender != 1) {
                    text += buildSpan(cga_dark_yellowHex, "He is equipped with:") + "<br><br>";
                } else {
                    text += buildSpan(cga_dark_yellowHex, "She is equipped with:") + "<br><br>";
                }
                if (actionData.TargetEquippedItems && actionData.TargetEquippedItems.length > 0) {
                    for (var i = 0; i < actionData.TargetEquippedItems.length; i++) {
                        text += buildFormattedSpan(cga_dark_green, actionData.TargetEquippedItems[i].ItemTypeName, 30, true);
                        text += buildSpan(cga_dark_cyan, "(" + getWornLocationName(actionData.TargetEquippedItems[i].LocationID) + ")") + "<br>";
                    }
                    addMessageRaw(text, false, true);
                } else {
                    text += buildSpan(cga_dark_green, "Nothing") + "<br>";
                    addMessageRaw(text, false, true);
                }
            } else {
                var text = buildSpan(cga_light_grayHex, actionData.LookerPlayerName + " is looking at you.") + "<br>";
                addMessageRaw(text, false, true);
            }
            break;
        case 1: //YouDontSee
            var text = buildSpan(cga_light_red, "You do not see " + actionData.BadTargetString + " here!") + "<br>";
            addMessageRaw(text, false, true);
            break;
        case 2: //SuccessPlayerThirdPerson
            var text = buildSpan(cga_light_grayHex, actionData.LookerPlayerName + " looks " + actionData.TargetPlayerName + " up and down.") + "<br>";
            addMessageRaw(text, false, true);
            break;
        case 3: //SuccessItem
            var text = buildSpan(cga_light_cyan, actionData.ItemTypeName) + "<br>";
            text += buildSpan(cga_light_grayHex, actionData.ItemTypeDescription) + "<br>";
            addMessageRaw(text, false, true);
            break;
        case 4: //BeMoreSpecific
            var text = beMoreSpecificList(actionData.PossibleLookTargets);
            addMessageRaw(text, false, true);
            break;
        case 5: //SuccessMob
            var text = buildSpan(cga_light_cyan, actionData.Name) + "<br>";
            text += buildSpan(cga_light_grayHex, actionData.Description) + "<br>"
            text += buildSpan(cga_light_grayHex, genderName(actionData.Gender) + " appears to be " + actionData.WoundLevel + ".") + "<br>";
            addMessageRaw(text, false, true);
            break;
    }
}

function hearMovement(actionData) {
    var text = buildSpan(cga_dark_magenta, "You hear movement " + toExitDirectionName(actionData.FromDirection) + ".") + "<br>";
    addMessageRaw(text, false, true);
}

function exp(actionData) {
    var extraExpNeeded = actionData.TotalExpForNextLevel - actionData.Exp;
    if (extraExpNeeded < 0) {
        extraExpNeeded = 0;
    }
    var expPercent = Math.round(actionData.Exp * 100 / actionData.TotalExpForNextLevel);
    var text = buildSpan(cga_dark_green, "Exp: ") + buildSpan(cga_dark_cyan, String(actionData.Exp)) + buildSpan(cga_dark_green, " Level: ") + buildSpan(cga_dark_cyan, String(actionData.Level)) + buildSpan(cga_dark_green, " Exp needed for next level: ") + buildSpan(cga_dark_cyan, String(extraExpNeeded) + " (" + String(actionData.TotalExpForNextLevel) + ") [" + expPercent + "%]") + "<br>";
    addMessageRaw(text, false, true);
}

function stat(actionData) {
    var text = buildSpan(cga_dark_green, "Name: ") + buildFormattedSpan(cga_dark_cyan, actionData.Name, 37, true) + buildSpan(cga_dark_green, "Lives/CP:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Lives) + "/" + String(actionData.CP), 9, false) + "<br>";
    text += buildSpan(cga_dark_green, "Race: ") + buildFormattedSpan(cga_dark_cyan, actionData.Race, 16, true) + buildSpan(cga_dark_green, "Exp: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.Exp), 16, true) + buildSpan(cga_dark_green, "Perception:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Perception), 7, false) + "<br>";
    text += buildSpan(cga_dark_green, "Class: ") + buildFormattedSpan(cga_dark_cyan, actionData.Class, 15, true) + buildSpan(cga_dark_green, "Level: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.Level), 14, true) + buildSpan(cga_dark_green, "Stealth:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Stealth), 10, false) + "<br>";
    text += buildSpan(cga_dark_green, "Hits:") + buildFormattedSpan(cga_dark_cyan, String(actionData.HP), 8, false) + buildSpan(cga_dark_cyan, "/") + buildFormattedSpan(cga_dark_cyan, String(actionData.MaxHP), 8, true) + buildSpan(cga_dark_green, "Armour Class:") + buildFormattedSpan(cga_dark_cyan, String(actionData.AC), 4, false) + buildSpan(cga_dark_cyan, "/") + buildFormattedSpan(cga_dark_cyan, String(actionData.DR), 3, true) + buildSpan(cga_dark_green, "Thievery:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Thievery), 9, false) + "<br>";
    if (actionData.MaxMA > 0) {
        text += buildSpan(cga_dark_green, "Mana:") + buildFormattedSpan(cga_dark_cyan, String(actionData.MA), 8, false) + buildSpan(cga_dark_cyan, "/") + buildFormattedSpan(cga_dark_cyan, String(actionData.MaxMA), 8, true) + buildSpan(cga_dark_green, "Spellcasting: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.SC), 7, true);
    } else {
        text += buildFormattedSpan(cga_dark_green, "", 43, true);
    }

    text += buildSpan(cga_dark_green, "Traps:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Traps), 12, false) + "<br>";
    text += buildFormattedSpan(cga_dark_green, "", 43, true) + buildSpan(cga_dark_green, "Picklocks:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Picklocks), 8, false) + "<br>";
    text += buildSpan(cga_dark_green, "Strength:") + "&nbsp;&nbsp;" + buildFormattedSpan(cga_dark_cyan, String(actionData.Strength), 9, true) + buildSpan(cga_dark_green, "Agility: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.Agility), 14, true) + buildSpan(cga_dark_green, "Tracking:") + buildFormattedSpan(cga_dark_cyan, String(actionData.Tracking), 9, false) + "<br>";
    text += buildSpan(cga_dark_green, "Intellect: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.Intellect), 9, true) + buildSpan(cga_dark_green, "Health:") + "&nbsp;&nbsp;" + buildFormattedSpan(cga_dark_cyan, String(actionData.Health), 14, true) + buildSpan(cga_dark_green, "Martial Arts:") + buildFormattedSpan(cga_dark_cyan, String(actionData.MartialArts), 5, false) + "<br>";
    text += buildSpan(cga_dark_green, "Willpower: ") + buildFormattedSpan(cga_dark_cyan, String(actionData.Willpower), 9, true) + buildSpan(cga_dark_green, "Charm:") + "&nbsp;&nbsp;&nbsp;" + buildFormattedSpan(cga_dark_cyan, String(actionData.Charm), 14, true) + buildSpan(cga_dark_green, "MagicRes:") + buildFormattedSpan(cga_dark_cyan, String(actionData.MagicRes), 9, false) + "<br>";
    addMessageRaw(text, false, true);
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function inventory(actionData) {
    var carryingText = "You are carrying ";
    var first = true;
    if (actionData.CoinRolls != null && actionData.CoinRolls.length > 0) {
        for (var i = 0; i < actionData.CoinRolls.length; i++) {
            if (!first) {
                carryingText += ", ";
            } else {
                first = false;
            }
            carryingText += String(actionData.CoinRolls[i].NumberCoins) + " " + (actionData.CoinRolls[i].NumberCoins > 1 ? pluralCoinName(actionData.CoinRolls[i].CoinTypeID) : singleCoinName(actionData.CoinRolls[i].CoinTypeID))
        }
    }
    var wornItems = new Array();
    if (actionData.WornItems && actionData.WornItems.length > 0) {
        for (var i = 0; i < actionData.WornItems.length; i++) {
            if (first != true) {
                carryingText += ", ";
            } else {
                first = false;
            }
            carryingText += actionData.WornItems[i].EquippedItemTypeName + " (" + getWornLocationName(actionData.WornItems[i].Location) + ")";
            wornItems.push(actionData.WornItems[i].EquippedItemTypeID);
        }
    }
    if (actionData.NonKeyInventory && actionData.NonKeyInventory.length > 0) {
        var wornItemIndex;
        var fixedCount;
        for (var i = 0; i < actionData.NonKeyInventory.length; i++) {
            wornItemIndex = wornItems.indexOf(actionData.NonKeyInventory[i].ItemTypeID);
            fixedCount = actionData.NonKeyInventory[i].Count;
            if (wornItemIndex >= 0) {
                wornItems.splice(wornItemIndex, 1);
                fixedCount--;
            }
            if (fixedCount > 0) {
                if (first != true) {
                    carryingText += ", ";
                } else {
                    first = false;
                }
                carryingText += fixStackName(fixedCount, actionData.NonKeyInventory[i].Name);
            }
        }
    }
    if (first == true) {
        carryingText += "nothing";
    }
    
    var keyText = "You have ";
    if (actionData.KeyInventory && actionData.KeyInventory.Length > 0) {
        keyText += "the following keys: ";
        for (var i = 0; i < actionData.KeyInventory.length; i++) {
            if (i > 0) {
                keyText += ", ";
            }
            keyText += fixStackName(actionData.KeyInventory[i].Count, actionData.KeyInventory[i].Name);
        }
    } else {
        keyText += "no keys";
    }
    keyText += ".";
    var finalText = buildSpan(cga_light_grayHex, carryingText) + "<br>";
    finalText += buildSpan(cga_light_grayHex, keyText) + "<br>";
    finalText += buildSpan(cga_dark_green, "Wealth: ") + buildSpan(cga_dark_cyan, String(actionData.TotalWealth) + " copper farthings") + "<br>";
    var encPercent = actionData.CurEncum * 100 / actionData.MaxEncum;

    finalText += buildSpan(cga_dark_green, "Encumbrance: ") + buildSpan(cga_dark_cyan, String(actionData.CurEncum) + "/" + String(actionData.MaxEncum) + " - ") + buildSpan(getEncLevelColor(encPercent), getEncLevelName(encPercent)) + buildSpan(cga_light_grayHex, " [" + String(Math.round(encPercent)) + "%]") + "<br>";
    addMessageRaw(finalText, false, true);
}

function getEncLevelName(encPercent) {
    if (encPercent <= 15)
        return "None";
    else if (encPercent <= 33)
        return "Light";
    else if (encPercent <= 66)
        return "Medium";
    else
        return "Heavy";
}

function getEncLevelColor(encPercent) {
    if (encPercent <= 15)
        return cga_light_grayHex;
    else if (encPercent <= 33)
        return cga_dark_green;
    else if (encPercent <= 66.6)
        return cga_yellowHex;
    else
        return cga_dark_red;
}

function getCoinNames(coinTypeID, numberCoins) {
    if (numberCoins > 1) {
        return pluralCoinName(coinTypeID);
    } else {
        return singleCoinName(coinTypeID);
    }
}


function get(actionData) {
    if (actionData.Success && actionData.Success == true) {
        if (actionData.PlayerID == playerID) {
            if (actionData.TargetType == 0) {
                var text = buildSpan(cga_light_grayHex, "You took " + actionData.Name + ".") + "<br>";
                addMessageRaw(text, false, true);
            } else {
                var text = buildSpan(cga_light_grayHex, "You picked up " + actionData.Count + " " + getCoinNames(actionData.CoinTypeID, actionData.Count)) + "<br>";
                addMessageRaw(text, false, true);
            }
        } else {
            if (actionData.TargetType == 0) {
                var text = buildSpan(cga_dark_yellowHex, actionData.PlayerName + " picks up " + actionData.Name + ".") + "<br>";
                addMessageRaw(text, false, true);
            } else {
                var text = buildSpan(cga_light_grayHex, actionData.PlayerName + " picks up some " + pluralCoinName(actionData.CoinTypeID)) + "<br>";
                addMessageRaw(text, false, true);
            }
        }
    } else {
        if (actionData.PossibleItemTypes == undefined || actionData.PossibleItemTypes.length == 0) {
            var text = buildSpan(cga_light_red, "You do not see " + actionData.TypedTarget + " here!") + "<br>";
            addMessageRaw(text, false, true);
            return;
        } else {
            var text = beMoreSpecificList(actionData.PossibleItemTypes); 
            addMessageRaw(text, false, true);
        }
    }
}

function drop(actionData) {
    if (actionData.Success && actionData.Success == true) {
        if (actionData.PlayerID == playerID) {
            if (actionData.TargetType == 0) {
                var text = buildSpan(cga_light_grayHex, "You dropped " + actionData.Name + ".") + "<br>";
                addMessageRaw(text, false, true);
            } else {
                var text = buildSpan(cga_light_grayHex, "You dropped " + String(actionData.Count) + " " + getCoinNames(actionData.CoinTypeID, actionData.Count) + ".") + "<br>";
                addMessageRaw(text, false, true);
            }
        } else {
            //var text = 
            if (actionData.TargetType == 0) {
                var text = buildSpan(cga_light_grayHex, actionData.PlayerName + " drops " + actionData.Name + ".") + "<br>";
                addMessageRaw(text, false, true);
            } else {
                var text = buildSpan(cga_light_grayHex, actionData.PlayerName + " drops some " + pluralCoinName(actionData.CoinTypeID) + ".") + "<br>";
                addMessageRaw(text, false, true);
            }
        }
    } else {
        if (actionData.PossibleItemTypes == undefined || actionData.PossibleItemTypes.length == 0) {
            var text = buildSpan(cga_light_red, "You don't have " + actionData.TypedTarget + " to drop!") + "<br>";
            addMessageRaw(text, false, true);
            return;
        } else {
            var text = beMoreSpecificList(actionData.PossibleItemTypes);
            addMessageRaw(text, false, true);
        }
    }
}

function equip(actionData) {
    if (actionData.PlayerID == playerID) {
        var text = buildSpan(cga_light_grayHex, "You are now wearing " + actionData.ItemName + ".") + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_dark_yellowHex, actionData.PlayerName + " wears " + actionData.ItemName + "!") + "<br>";
        addMessageRaw(text, false, true);
    }
}

function unequip(actionData) {
    if (actionData.PlayerID == playerID) {
        var text = buildSpan(cga_light_grayHex, "You have removed " + actionData.ItemName + ".") + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_dark_yellowHex, actionData.PlayerName + " removes " + actionData.ItemName + "!") + "<br>";
        addMessageRaw(text, false, true);
    }
}

function give(actionData) {
    if (actionData.Result == 0) {
        if (actionData.GiverPlayerID == playerID) {
            if (actionData.IsCash == false) {
                var text = buildSpan(cga_light_grayHex, "You give " + actionData.GivenItemName + " to " + actionData.GivenToPlayerName + ".") + "<br>";
                addMessageRaw(text, false, true);
            } else {
                var text = buildSpan(cga_light_grayHex, "You give " + actionData.GivenCash.NumberCoins + " " + getCoinNames(actionData.GivenCash.CoinTypeID, actionData.GivenCash.NumberCoins)  + " to " + actionData.GivenToPlayerName + ".") + "<br>";
                addMessageRaw(text, false, true);
            }
        } else {
            if (actionData.GivenToPlayerID != playerID) {
                if (actionData.IsCash == false) {
                    var text = buildSpan(cga_light_grayHex, actionData.GiverPlayerName + " gives something to " + actionData.GivenToPlayerName + ".") + "<br>";
                    addMessageRaw(text, false, true);
                } else {
                    var text = buildSpan(cga_light_grayHex, actionData.GiverPlayerName + " gives " + actionData.GivenToPlayerName + " some coins.") + "<br>";
                    addMessageRaw(text, false, true);
                }
            } else {
                if (actionData.IsCash == false) {
                    var text = buildSpan(cga_light_grayHex, actionData.GiverPlayerName + " gives you " + actionData.GivenItemName + ".") + "<br>";
                    addMessageRaw(text, false, true);
                } else {
                    var text = buildSpan(cga_light_grayHex, actionData.GiverPlayerName + " gives you " + String(actionData.GivenCash.NumberCoins) + " " + getCoinNames(actionData.GivenCash.CoinTypeID, actionData.GivenCash.NumberCoins) + ".") + "<br>";
                    addMessageRaw(text, false, true);
                }
            }
        }
    } else {
        switch (actionData.Result) {
            case 1: //BeMoreSpecificItems
                var text = beMoreSpecificList(actionData.BeMoreSpecificItems);
                addMessageRaw(text, false, true);
                break;
            case 2: //BeMoreSpecificPersons
                var text = beMoreSpecificList(actionData.BeMoreSpecificPersons);
                addMessageRaw(text, false, true);
                break;
            case 3: //3 == DontHaveItemToGive
                var text = buildSpan(cga_light_grayHex, "You don't have " + actionData.BadTargetString + " to give!") + "<br>";
                addMessageRaw(text, false, true);
                break;
            case 4: //4 == YouDontSeePerson
                var text = buildSpan(cga_light_grayHex, "You don't see " + actionData.BadTargetString + " here!") + "<br>";
                addMessageRaw(text, false, true);
                break;
            default:
                alert("Unhandled 'give' result - " + String(actionData.Result));
                break;
        }
    }
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

function combatRound(actionData) {
    var text = "";
    var attackerName;
    var verbNumber;
    if (actionData.AttackerID != playerID) {
        if (actionData.AttackerTypeID == 0) {
            attackerName = actionData.AttackerName;
        } else {
            attackerName = "The " + actionData.AttackerName
        }
        isOrAre = ""
        verbNumber = 1;
    } else {
        attackerName = "You";
        verbNumber = 0;
    }
    var targetName;
    if (actionData.TargetID != playerID) {
        targetName = actionData.TargetName;
    } else {
        targetName = "you";
    }
    for (var i = 0; i < actionData.SwingInfos.length; i++) {
        switch (actionData.SwingInfos[i].SwingResult) {
            case 1: //hit
            case 2: //crit
                text += buildSpan(cga_light_red, attackerName + " " + (actionData.SwingInfos[i].SwingResult == 2 ? "critically " : "") + actionData.SwingInfos[i].Verbs[verbNumber] + " " + targetName + " for " + String(actionData.SwingInfos[i].Damage) + "!") + "<br>";
                if (actionData.SwingInfos[i].SwingConsequences && actionData.SwingInfos[i].SwingConsequences.length > 0) {
                    for (var j = 0; j < actionData.SwingInfos[i].SwingConsequences.length; j++) {
                        switch (actionData.SwingInfos[i].SwingConsequences[j].ConsequenceType) {
                            case 0: //drop to ground
                                var dropText = (actionData.TargetID != playerID ? "drops" : "drop");
                                text += buildSpan(cga_light_red, capitalizeFirstLetter(targetName) + " " + dropText + " to the ground!") + "<br>";
                                break;
                            case 1: //death
                                if (actionData.SwingInfos[i].SwingConsequences[j].RIPFigureType == 1) {
                                    text += buildSpan(cga_light_grayHex, actionData.SwingInfos[i].SwingConsequences[j].DeathMessage) + "<br>";
                                } else {
                                    var isOrAreText = (actionData.TargetID != playerID ? "is" : "are");
                                    text += buildSpan(cga_light_red, capitalizeFirstLetter(targetName) + " " + isOrAreText + " dead!") + "<br>";
                                }
                                break;
                            case 3: //gain experience
                                for (var k = 0; k < actionData.SwingInfos[i].SwingConsequences[j].KillerPlayerIDs.length; k++) {
                                    if (actionData.SwingInfos[i].SwingConsequences[j].KillerPlayerIDs[k] == playerID) {
                                        text += buildSpan(cga_light_grayHex, "You gain " + String(actionData.SwingInfos[i].SwingConsequences[j].ExpEach) + " experience.") + "<br>";
                                    }
                                }
                                break;
                            case 5: //cashDrop
                                for (var k = 0; k < actionData.SwingInfos[i].SwingConsequences[j].DroppedCoinRolls.length; k++) {
                                    text += buildSpan(cga_light_grayHex, String(actionData.SwingInfos[i].SwingConsequences[j].DroppedCoinRolls[k].NumberCoins) + " " + (actionData.SwingInfos[i].SwingConsequences[j].DroppedCoinRolls[k].NumberCoins > 1 ? pluralCoinName(actionData.SwingInfos[i].SwingConsequences[j].DroppedCoinRolls[k].CoinTypeID) + " drop" : singleCoinName(actionData.SwingInfos[i].SwingConsequences[j].DroppedCoinRolls[k].CoinTypeID) + " drops") + " to the ground.") + "<br>";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                break;
            case 0: //miss
                text += buildSpan(cga_dark_cyan, attackerName + " " + actionData.SwingInfos[i].Verbs[verbNumber] + " at " + targetName + "!") + "<br>";
                break;
            case 3: //dodge
                var dodgeText;
                if (targetName == "you") {
                    dodgeText = "you dodge";
                } else {
                    dodgeText = "they dodge";
                }
                text += buildSpan(cga_dark_cyan, attackerName + " " + actionData.SwingInfos[i].Verbs[verbNumber] + " at " + targetName + ", but " + dodgeText + " out of the way!") + "<br>";
                break;
            case 4: //glance
                text += buildSpan(cga_light_red, attackerName + " " + actionData.SwingInfos[i].Verbs[verbNumber] + " " + targetName + ", but the swing glances off!") + "<br>";
                break;
            case 5: //spell
                
                break;
        }
    }
    addMessageRaw(text, false, true);
}

function attack(actionData) {
    if (actionData.Result == -1) {
        commandHadNoEffect();
        return;
    }
    if (actionData.Result == -2) {
        var text = buildSpan(cga_light_red, "PvP is disabled in this realm.") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    var text = buildSpan(cga_dark_yellowHex, "*Combat Engaged*") + "<br>";
    //todo: show current target somewhere on screen
    addMessageRaw(text, false, true);
}

function commandHadNoEffect() {
    var text = buildSpan(cga_light_grayHex, "Your command had no effect.") + "<br>";
    addMessageRaw(text, false, true);
}

function movesToAttack(actionData) {
    if (actionData.TargetID != playerID) {
        var text = buildSpan(cga_dark_yellowHex, actionData.AttackerName + " moves to attack " + actionData.TargetName + ".") + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_dark_yellowHex, actionData.AttackerName + " moves to attack you!") + "<br>";
        addMessageRaw(text, false, true);
    }
}

function aiCommand(actionData) {
    var aiText = buildSpan(cga_light_green, '(AI): ' + actionData.TypedCommand);
    addMessageRaw(aiText, true, false);
}

function getPriceNameInCopper(priceInCopper) {
    if (priceInCopper > 1) {
        return String(priceInCopper) + " " + pluralCoinName(1);
    } else if (priceInCopper == 1) {
        return String(priceInCopper) + " " + singleCoinName(1);
    } else {
        return "Free";
    }
}

function listCommand(actionData) {
    if (actionData.InShop == false) {
        var text = buildSpan(cga_light_red, "You cannot LIST if you are not in a shop!") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    var text = buildSpan(cga_light_grayHex, "The following items are for sale here:") + "<br><br>";
    text += buildFormattedSpan(cga_dark_green, "Item", 30, true) + buildFormattedSpan(cga_dark_cyan, "Quantity", 12, true) + buildSpan(cga_dark_cyan, "Price") + "<br>";
    text += buildSpan(cga_dark_cyan, "------------------------------------------------------") + "<br>";

    if (actionData.ItemsForSale && actionData.ItemsForSale.length > 0) {
        for (var i = 0; i < actionData.ItemsForSale.length; i++) {
            text += buildFormattedSpan(cga_dark_green, actionData.ItemsForSale[i].ItemTypeName + " ", 30, true) + buildFormattedSpan(cga_dark_cyan, String(actionData.ItemsForSale[i].Count) + " ", 5, true) + buildFormattedSpan(cga_dark_cyan, String(actionData.ItemsForSale[i].Price) + " ", 10, false) + buildSpan(cga_dark_cyan, "copper farthings") + "<br>";
        }
    }
    addMessageRaw(text, false, true);
}

function buy(actionData) {
    if (actionData.BuyingPlayerID == playerID) {
        if (actionData.InShop == false) {
            var text = buildSpan(cga_light_red, "You cannot BUY if you are not in a shop!") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.BadSyntax == true) {
            var text = buildSpan(cga_light_red, "Syntax: BUY {item}") + "<br>";
            addMessageRaw(text, false, true)
        }
        if (actionData.NotKnownItem == true) {
            var text = buildSpan(cga_light_grayHex, actionData.TypedTarget + " is not a known item.") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.BeMoreSpecificItems) {
            var text = beMoreSpecificList(actionData.BeMoreSpecificItems);
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.CantAffordItemName) {
            var text = buildSpan(cga_light_grayHex, "You cannot afford " + actionData.CantAffordItemName + ".") + "<br>"
            addMessageRaw(text, false, true);
            return;
        }
        var text = buildSpan(cga_light_grayHex, "You just bought " + actionData.BoughtItemTypeName + " for " + String(actionData.CopperCost) + " " + getCoinNames(1, actionData.CopperCost)) + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_light_grayHex, "You see " + actionData.BuyingPlayerName + " buy " + actionData.BoughtItemTypeName + ".") + "<br>";
        addMessageRaw(text, false, true);
    }
}

function sell(actionData) {
    if (actionData.SellingPlayerID == playerID) {
        if (actionData.InShop == false) {
            var text = buildSpan(cga_light_red, "You cannot SELL if you are not in a shop!") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.BadSyntax == true) {
            var text = buildSpan(cga_light_red, "Syntax: SELL {item}") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.NotKnownItem == true) {
            var text = buildSpan(cga_light_grayHex, "You don't have " + actionData.TypedTarget + " to sell!") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.BeMoreSpecificItems) {
            var text = beMoreSpecificList(actionData.BeMoreSpecificItems);
            addMessageRaw(text, false, true);
            return;
        }
        if (actionData.CannotSellItemName) {
            var text = buildSpan(cga_light_grayHex, "You cannot sell " + actionData.CannotSellItemName + " here.") + "<br>";
            addMessageRaw(text, false, true);
            return;
        }
        var text = buildSpan(cga_light_grayHex, "You sold " + actionData.SoldItemTypeName + " for " + String(actionData.CopperAmount) + " " + getCoinNames(1, actionData.CopperAmount) + ".") + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_light_grayHex, "You see " + actionData.SellingPlayerName + " sell " + actionData.SoldItemTypeName + ".") + "<br>";
        addMessageRaw(text, false, true);
    }
}

function changeAISetting(actionData) {
    if (actionData.NotAISubscriber == true) {
        alert("You must be a subscriber to enable this feature.");
        $("#chkEnableAI").checked = false;
        return;
    }
    if (actionData.AIAlreadyEnabled == true) {
        var text = buildSpan(cga_light_green, "*** AI Already Enabled ***") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.AIAlreadyDisabled == true) {
        var text = buildSpan(cga_light_red, "*** AI Already Disabled ***") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.AIEnabled == true) {
        var text = buildSpan(cga_light_green, "*** AI Enabled ***") + "<br>";
        addMessageRaw(text, false, true);
        return;
    } else if (actionData.AIEnabled == false) {
        var text = buildSpan(cga_light_red, "*** AI Disabled ***") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
}

function trainStats(actionData) {
    if (actionData.NotInTrainer) {
        var text = buildSpan(cga_light_red, "You can only TRAIN when you are with a trainer.") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.TrainStats) {
        showStats(actionData);
    }
}

function showStats(actionData) {
    $('#lblFirstName').text(actionData.FirstName);
    $('#txtFirstName').prop('disabled', true);
    $('#txtLastName').val(actionData.LastName);
    $('#lblRace').text(actionData.Race);
    $('#lblClass').text(actionData.Class);
    $('#lblCPLeft').text(actionData.CP);
    $('#txtOldCPs').val(actionData.CP);
    $('#lblStrengthRange').text('( ' + String(actionData.MinStrength) + ' to ' + String(actionData.MaxStrength) + ' )');
    $('#txtOldStrengthValue').val(actionData.Strength);
    $('#txtMinStrength').val(actionData.MinStrength);
    $('#txtMaxStrength').val(actionData.MaxStrength);
    $('#txtStrengthValue').val(actionData.Strength);
    $('#lblIntellectRange').text('( ' + String(actionData.MinIntellect) + ' to ' + String(actionData.MaxIntellect) + ' )');
    $('#txtOldIntellectValue').val(actionData.Intellect);
    $('#txtMinIntellect').val(actionData.MinIntellect);
    $('#txtMaxIntellect').val(actionData.MaxIntellect);
    $('#txtIntellectValue').val(actionData.Intellect);
    $('#lblWillpowerRange').text('( ' + String(actionData.MinWillpower) + ' to ' + String(actionData.MaxWillpower) + ' )');
    $('#txtOldWillpowerValue').val(actionData.Willpower);
    $('#txtMinWillpower').val(actionData.MinWillpower);
    $('#txtMaxWillpower').val(actionData.MaxWillpower);
    $('#txtWillpowerValue').val(actionData.Willpower);
    $('#lblAgilityRange').text('( ' + String(actionData.MinAgility) + ' to ' + String(actionData.MaxAgility) + ' )');
    $('#txtOldAgilityValue').val(actionData.Agility);
    $('#txtMinAgility').val(actionData.MinAgility);
    $('#txtMaxAgility').val(actionData.MaxAgility);
    $('#txtAgilityValue').val(actionData.Agility);
    $('#lblHealthRange').text('( ' + String(actionData.MinHealth) + ' to ' + String(actionData.MaxHealth) + ' )');
    $('#txtOldHealthValue').val(actionData.Health);
    $('#txtMinHealth').val(actionData.MinHealth);
    $('#txtMaxHealth').val(actionData.MaxHealth);
    $('#txtHealthValue').val(actionData.Health);
    $('#lblCharmRange').text('( ' + String(actionData.MinCharm) + ' to ' + String(actionData.MaxCharm) + ' )');
    $('#txtOldCharmValue').val(actionData.Charm);
    $('#txtMinCharm').val(actionData.MinCharm);
    $('#txtMaxCharm').val(actionData.MaxCharm);
    $('#txtCharmValue').val(actionData.Charm);
    $('#mainDisplay').toggle(false);
    $('#divCharacterSetup').toggle(true);
}

function checkStats() {
    var cps = Number($('#txtOldCPs').val());
    var totalCost = checkStat('Strength');
    totalCost += checkStat('Intellect');
    totalCost += checkStat('Willpower');
    totalCost += checkStat('Agility');
    totalCost += checkStat('Health');
    totalCost += checkStat('Charm');
    var finalCPs = cps - totalCost;
    $('#lblCPLeft').text(finalCPs);
    if (finalCPs >= 0) {
        $('#lblCPLeft').css('color', 'black');
        $('#btnSave').prop('disabled', false);
    } else {
        $('#lblCPLeft').css('color', 'red');
        $('#btnSave').prop('disabled', true);
    }
}

function checkStat(statName) {
    var oldID = 'txtOld' + statName + 'Value';
    var newID = 'txt' + statName + 'Value';
    var minID = 'txtMin' + statName;
    var maxID = 'txtMax' + statName;
    var warningID = 'lbl' + statName + 'Warning';

    var oldValue = Number($('#' + oldID).val());
    var newValue = Number($('#' + newID).val());
    var minValue = Number($('#' + minID).val());
    var maxValue = Number($('#' + maxID).val());
    
    if (newValue < oldValue || newValue < minValue) {
        $('#' + warningID).text('Cannot decrease that low');
        $('#' + warningID).toggle(true);
        return;
    }
    if (newValue > maxValue) {
        $('#' + warningID).text('Cannot increase that high');
        $('#' + warningID).toggle(true);
        return;
    }
    $('#' + warningID).toggle(false);
    $('#' + warningID).text('');
    return calcChangeCost(minValue, oldValue, newValue);
}

function calcChangeCost(baseValue, oldValue, newValue) {
    var totalCost = 0;
    if (newValue > oldValue) {
        for (var i = oldValue; i < newValue; i++) {
            totalCost += Math.floor((i - baseValue) / 10) + 1;
        }
    } else if (oldValue > newValue) {
        for (var i = oldValue; i > newValue; i--) {
            totalCost -= ((i - baseValue - 1) / 10) + 1;
        }
    }
    return totalCost;
}

function saveStats() {
    var lastName = $('#txtLastName').val();
    var strength = Number($('#txtStrengthValue').val());
    var intel = Number($('#txtIntellectValue').val());
    var willpower = Number($('#txtWillpowerValue').val());
    var agility = Number($('#txtAgilityValue').val());
    var health = Number($('#txtHealthValue').val());
    var charm = Number($('#txtCharmValue').val());

    var blah = hub.server.trainStats(lastName, strength, intel, willpower, agility, health, charm).done(function (result) {
        if (result == 0) {
            $('#divCharacterSetup').toggle(false);
            $('#mainDisplay').toggle(true);
            var text = buildSpan(cga_light_grayHex, "Stats trained successfully.") + "<br>";
            addMessageRaw(text, false, true);
        } else {
            switch (result) {
                case 1:
                    alert('Error logged - Not at trainer');
                    break;
                case 2:
                    alert('Error logged - Not enough CPs for stat levels');
                    break;
                case 3:
                    alert('Last name is too long');
                    break;
                default:
                    alert('Something blew up');
                    break;
            }
        };
    });
}

function levelUp(actionData) {
    if (actionData.NotEnoughExp) {
        var text = buildSpan(cga_light_grayHex, 'You do not have the required experience to train to the next level!') + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    var text = buildSpan(cga_light_grayHex, "Welcome to level " + String(actionData.NewLevel) + "!") + "<br>";
    text += buildSpan(cga_light_grayHex, "You gain " + String(actionData.NumberLivesEarned) + " additional lives.") + "<br>";
    text += buildSpan(cga_light_grayHex, "You gain " + String(actionData.NumberCPsEarned) + " CPs") + "<br>";
    addMessageRaw(text, false, true);
}

function mortallyWounded(actionData) {
    var text = buildSpan(cga_light_red, "You may not do that while you are mortally wounded!") + "<br>";
    addMessageRaw(text, false, true);
}

function rest(actionData) {
    if (actionData.PlayerID == playerID) {
        var text = buildSpan(cga_light_grayHex, 'You are now resting.') + "<br>";
        addMessageRaw(text, false, true);
    } else {
        var text = buildSpan(cga_light_grayHex, actionData.PlayerName + ' stops to rest.') + "<br>";
        addMessageRaw(text, false, true);
    }
}

function shout(actionData) {
    if (actionData.FromExitDirectionID != undefined && actionData.FromExitDirectionID != null) {
        var text = buildSpan(cga_dark_green, 'Someone yells from ' + fromExitDirectionName(actionData.FromExitDirectionID) + ' "' + actionData.ShoutText + '"') + "<br>";
        addMessageRaw(text, false, true);
        if (conversationWindow != null) {
            var convDateTime = getConversationDateString();
            conversationWindow.addComm(convDateTime, 'Someone', 4, fromExitDirectionName(actionData.FromExitDirectionID), actionData.ShoutText) + "<br>";
        }
    } else {
        if (actionData.PlayerID != playerID) {
            var text = buildSpan(cga_dark_green, actionData.PlayerName + ' yells "' + actionData.ShoutText + '"') + "<br>";
            addMessageRaw(text, false, true);
            if (conversationWindow != null) {
                var convDateTime = getConversationDateString();
                conversationWindow.addComm(convDateTime, actionData.PlayerName, 4, null, actionData.ShoutText);
            }
        } else {
            var text = buildSpan(cga_dark_green, 'You yell "' + actionData.ShoutText + '"') + "<br>";
            addMessageRaw(text, false, true);
            if (conversationWindow != null) {
                conversationWindow.addComm(getConversationDateString(), null, 4, null, actionData.ShoutText);
            }
        }
    }
}

function telepath(actionData) {
    if (actionData.Result == -1) {
        var text = buildSpan(cga_light_grayHex, "You have to telepath something!") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -2) {
        var text = buildSpan(cga_light_grayHex, "Cannot find player!") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -3) {
        var text = beMoreSpecificList(actionData.BeMoreSpecificPlayers);
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -4) {
        var text = buildSpan(cga_light_grayHex, 'Uhh... Why are you telepathing yourself?') + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 1) {
        if (actionData.SentFromPlayerID) {
            var text = buildSpan(cga_dark_green, actionData.SentFromPlayerName + " telepaths: ");
            text += buildSpan(cga_light_grayHex, actionData.TelepathText) + "<br>";
            addMessageRaw(text, false, true);
            if (conversationWindow != null) {
                conversationWindow.addComm(getConversationDateString(), actionData.SentFromPlayerName, 3, null, actionData.TelepathText);
            }
            return;
        } else {
            var text = buildSpan(cga_light_grayHex, '--- Telepath Sent to ' + actionData.SentToPlayerName + ' ---') + "<br>";
            addMessageRaw(text, false, true);
            if (conversationWindow != null) {
                conversationWindow.addComm(getConversationDateString(), null, 3, actionData.SentToPlayerName, actionData.TelepathText);
            }
            return;
        }
    }
}

function broadcast(actionData) {
    if (actionData.Result == -1) {
        var text = buildSpan(cga_yellowHex, "You are not currently on a broadcast channel.") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 0) {
        var text = buildSpan(cga_yellowHex, "The following users are on channel " + actionData.BroadcastChannel + ":") + "<br>";
        var users = '';
        for (var i = 0; i < actionData.PlayersOnChannel.length; i++) {
            if (i > 0) {
                users += ', ';
            }
            users += actionData.PlayersOnChannel[i].Name;
        }
        text += buildSpan(cga_yellowHex, users) + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 1) {
        var text = buildSpan(cga_yellowHex, 'Broadcast from ' + actionData.PlayerName + ' "' + actionData.BroadcastText + '"') + "<br>";
        addMessageRaw(text, false, true);
        if (conversationWindow != null) {
            conversationWindow.addComm(getConversationDateString(), actionData.PlayerName, 5, null, actionData.BroadcastText);
        }
    }
}

function tell(actionData) {
    if (actionData.Result == -1) {
        var text = buildSpan(cga_light_grayHex, "You have to direct something!") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -2) {
        var text = buildSpan(cga_light_grayHex, "Cannot find player!") + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -3) {
        var text = beMoreSpecificList(actionData.BeMoreSpecificPlayers);
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -4) {
        var text = buildSpan(cga_light_grayHex, 'Uhh... Why are you talking to yourself?') + "<br>";
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 1) {
        if (actionData.SentFromPlayerID != playerID) {
            if (actionData.SentToPlayerID == playerID) {
                var text = buildSpan(cga_dark_green, actionData.SentFromPlayerName + ' says (to you) "' + actionData.TellText + '"') + '<br>';
                addMessageRaw(text, false, true);
                if (conversationWindow != null) {
                    conversationWindow.addComm(getConversationDateString(), actionData.SentFromPlayerName, 7, null, actionData.TellText);
                }
            } else {
                var text = buildSpan(cga_dark_green, actionData.SentFromPlayerName + ' says (to ' + actionData.SentToPlayerName + ') "' + actionData.TellText + '"') + '<br>';
                addMessageRaw(text, false, true);
                if (conversationWindow != null) {
                    conversationWindow.addComm(getConversationDateString(), actionData.SentFromPlayerName, 7, actionData.SentToPlayerName, actionData.TellText);
                }
            }
            return;
        } else {
            var text = buildSpan(cga_light_grayHex, '--- Message Directed to ' + actionData.SentToPlayerName + ' ---') + "<br>";
            addMessageRaw(text, false, true);
            if (conversationWindow != null) {
                conversationWindow.addComm(getConversationDateString(), null, 7, actionData.SentToPlayerName, actionData.TellText);
            }
            return;
        }
    }
}

function join(actionData) {
    if (actionData.Result == -1) {
        var text = buildSpan(cga_light_red, 'Syntax: JOIN {channel number}') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -2) {
        var text = buildSpan(cga_light_red, 'Please enter a valid number between 1 and 999999999') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 1) {
        var text = buildSpan(cga_yellowHex, actionData.PlayerName + ' just left your channel (' + actionData.ChannelID + ')') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == 2) {
        if (actionData.PlayerID != playerID) {
            var text = buildSpan(cga_yellowHex, actionData.PlayerName + ' just joined your channel (' + actionData.ChannelID + ')') + "<br>";
            addMessageRaw(text, false, true);
        } else {
            var text = buildSpan(cga_yellowHex, 'You just joined channel ' + actionData.ChannelID) + "<br>";
            addMessageRaw(text, false, true);
        }
    }
}

function read(actionData) {
    if (actionData.Result == -1) {
        var text = buildSpan(cga_light_red, 'Syntax: Read {Item}') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -2) {
        var text = buildSpan(cga_light_red, 'You do not have ' + actionData.ReadTarget + ' in your inventory!') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -3) {
        var text = beMoreSpecificList(actionData.PossibleReadTargets);
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -4) {
        var text = buildSpan(cga_light_red, 'You may not read that item!') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -5) {
        var text = buildSpan(cga_light_red, 'There are no more uses remaining in ' + actionData.ItemName + '!') + '<br>';
        addMessageRaw(text, false, true);
        return;
    }
    if (actionData.Result == -6) {
        addMessageRaw(buildSpan(cga_light_red, 'You may not use that item!') + '<br>', false, true);
        return;
    }
    if (actionData.Result == -7) {
        addMessageRaw(buildSpan(cga_light_red, 'You already know that spell!') + '<br>', false, true);
        return;
    }
    if (actionData.Result == 1) {
        addMessageRaw(buildSpan(cga_light_grayHex, 'You add ' + actionData.SpellName + ' to your spellbook!') + '<br>', false, true);
        return;
    }
    if (actionData.Result == 2) {
        addMessageRaw(buildSpan(cga_light_grayHex, actionData.PoofItemName + ' disappears from your inventory!') + '<br>', false, true);
        return;
    }
}

function sys(actionData) {
    if (actionData.Result == -1) {
        addMessageRaw("Player not found", false, true);
        return;
    }
    if (actionData.Result == -2) {
        addMessageRaw(beMoreSpecificList(actionData.PossiblePlayers), false, true);
        return;
    }
    if (actionData.Result == -3) {
        addMessageRaw("You need to specify a player name", false, true);
        return;
    }
    if (actionData.Result == 1) {
        addMessageRaw("sys action performed!", false, true);
        return;
    }
}

function spells(actionData) {
    if (actionData.Result == -1) {
        addMessageRaw(buildSpan(cga_light_grayHex, 'You don\'t know any spells!') + '<br>', false, true);
        return;
    }
    var text = buildSpan(cga_light_grayHex, 'You know the following spells:') + '<br>';
    text += buildSpan(cga_light_cyan, 'Level Mana Short Spell Name') + '<br>';
    for (var i = 0; i < actionData.Spells.length; i++) {
        text += buildFormattedSpan(cga_dark_cyan, String(actionData.Spells[i].Level), 3, false) + '&nbsp;&nbsp;&nbsp;' + buildFormattedSpan(cga_dark_cyan, String(actionData.Spells[i].Mana), 4, true) + ' ' + buildFormattedSpan(cga_dark_cyan, actionData.Spells[i].ShortCommand, 5, true) + ' ' + buildSpan(cga_dark_cyan, actionData.Spells[i].Name) + '<br>';
    }
    addMessageRaw(text, false, true);
}

function castSpell(actionData) {
    switch (actionData.Result) {
        case -1:
            mortallyWounded(actionData);
            return;
        case -2:
            addMessageRaw(buildSpan(cga_light_red, 'You may not cast that spell!') + '<br>', false, true);
            return;
        case -3:
            addMessageRaw(buildSpan(cga_light_red, 'You must specify a target for that spell!') + '<br>', false, true);
            return;
        case -4:
            addMessageRaw(buildSpan(cga_light_red, 'You may not specify a target for that spell!') + '<br>', false, true);
            return;
        case -5:
            addMessageRaw(beMoreSpecificList(actionData.PotentialTargets), false, true);
            return;
        case -6:
            addMessageRaw(buildSpan(cga_light_red, 'You don\'t see ' + actionData.TargetName + ' here!') + '<br>', false, true);
            return;
        case -7:
            addMessageRaw(buildSpan(cga_light_red, 'You do not have enough manaa to cast that spell!') + '<br>', false, true);
            return;
        case -8:
            addMessageRaw(buildSpan(cga_light_red, 'You have already cast a spell this round!') + '<br>', false, true);
            return;
        case -9:
            addMessageRaw(buildSpan(cga_light_grayHex, 'Your spell has no effect on ' + actionData.TargetName + '!') + '<br>', false, true);
            return;
        case -10:
            addMessageRaw(buildSpan(cga_light_red, 'You feel overcome with guilt and break off your attack.') + '<br>', false, true);
            return;
        case -12:
            addMessageRaw(buildSpan(cga_light_red, 'PvP is not allowed in this Realm!') + '<br>', false, true);
            return;
        case -11:
            if (actionData.CasterID == playerID) {
                addMessageRaw(buildSpan(cga_dark_cyan, 'You attempt to cast ' + actionData.SpellName + ', but fail.') + '<br>', false, true);
            } else {
                addMessageRaw(buildSpan(cga_dark_cyan, actionData.CasterName + ' attempts to cast ' + actionData.SpellName + ', but fails.') + '<br>', false, true);
            }
            return;
        case 1:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 2:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 3:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 4:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 5:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 6:
            if (actionData.StartMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.StartMessage) + '<br>', false, true);
            }
            if (actionData.CastMessage != null) {
                addMessageRaw(buildSpan(actionData.EvilInCombat == true ? cga_light_red : cga_light_cyan, actionData.CastMessage) + '<br>', false, true);
            }
            return;
        case 7:
            if (actionData.CasterID == playerID) {
                addMessageRaw(buildSpan(cga_dark_yellowHex, 'You move to cast ' + actionData.SpellName + ' upon ' + actionData.TargetName + '!') + '<br>' + buildSpan(cga_dark_yellowHex, '*Combat Engaged*') + '<br>', false, true);
            } else {
                var targetName = (actionData.TargetID != playerID ? actionData.TargetName : 'you');
                addMessageRaw(buildSpan(cga_dark_yellowHex, actionData.CasterName + ' moves to cast upon ' + targetName + '!'), false, true);
            }
            return;
    }
}

function start(hubUrl) {
    $(document).keypress(function (e) {
        if (e.which == 13) {
            // enter pressed
            sendMessage();
        }
    });

    //***debug***
    //$.connection.hub.logging = true;


    //Set the hubs URL for the connection
    $.connection.hub.url = hubUrl;

    // Declare a proxy to reference the hub.
    hub = $.connection.webMUDHub;

    // Create a function that the hub can call to broadcast messages.
    hub.client.sendActionToPlayer = function (action) {
        //alert(action.Action);
        if (action) {
            switch (action.Action) {
                case 1: //showPrompt
                    updateHPMA(action.ActionData);
                    break;
                case 2: //gossip
                    playerGossips(action.ActionData);
                    break;
                case 3: //playerEnters
                    playerEnters(action.ActionData);
                    break;
                case 4: //playerExits
                case 5: //playerDisconnects
                    playerDisconnects(action.ActionData);
                    break;
                case 6: //showRoom
                    showRoom(action.ActionData);
                    break;
                case 7: //playerSaysInRoom
                    playerSaysInRoom(action.ActionData);
                    break;
                case 8: //genericText
                    genericText(action.ActionData);
                    break;
                case 9: //entersTheRoom
                    entersTheRoom(action.ActionData);
                    break;
                case 10: //playerMove
                    break;
                case 11: //runsIntoWall
                    runsIntoWall(action.ActionData);
                    break;
                case 12: //leavesTheRoom
                    leavesTheRoom(action.ActionData);
                    break;
                case 13: //lookingToDirection
                    lookingToDirection(action.ActionData);
                    break;
                case 14: //peekingFromDirection
                    peekingFromDirection(action.ActionData);
                    break;
                case 15: //lookingAroundRoom
                    lookingAroundRoom(action.ActionData);
                    break;
                case 16: //look (at something)
                    lookingAtSomething(action.ActionData);
                    break;
                case 17: //hearMovement
                    hearMovement(action.ActionData);
                    break;
                case 18: //exp
                    exp(action.ActionData);
                    break;
                case 19: //stat
                    stat(action.ActionData);
                    break;
                case 20: //inventory
                    inventory(action.ActionData);
                    break;
                case 21: //get
                    get(action.ActionData);
                    break;
                case 22: //drop
                    drop(action.ActionData);
                    break;
                case 23: //equip
                    equip(action.ActionData);
                    break;
                case 24: //unequip
                    unequip(action.ActionData);
                    break;
                case 25: //give
                    give(action.ActionData);
                    break;
                case 26: //breakCombat
                    breakCombat(action.ActionData);
                    break;
                case 27: //combatRound
                    combatRound(action.ActionData);
                    break;
                case 28: //attack
                    attack(action.ActionData);
                    break;
                case 29: //movesToAttack
                    movesToAttack(action.ActionData);
                    break;
                case 30: //aiCommand
                    aiCommand(action.ActionData);
                    break;
                case 31: //list
                    listCommand(action.ActionData);
                    break;
                case 32: //buy
                    buy(action.ActionData);
                    break;
                case 33: //sell
                    sell(action.ActionData);
                    break;
                case 34: //changeAISetting
                    changeAISetting(action.ActionData);
                    break;
                case 35: //trainStats
                    trainStats(action.ActionData);
                    break;
                case 36: //train
                    levelUp(action.ActionData);
                    break;
                case 37: //mortally wounded
                    mortallyWounded(action.ActionData);
                    break;
                case 38: //rest
                    rest(action.ActionData);
                    break;
                case 39: //shout
                    shout(action.ActionData);
                    break;
                case 40: //telepath
                    telepath(action.ActionData);
                    break;
                case 41: //broadcast
                    broadcast(action.ActionData);
                    break;
                case 42: //tell
                    tell(action.ActionData);
                    break;
                case 43: //join
                    join(action.ActionData);
                    break;
                case 44: //read
                    read(action.ActionData);
                    break;
                case 45: //sys
                    sys(action.ActionData);
                    break;
                case 46: //spells
                    spells(action.ActionData);
                    break;
                case 47: //castSpell
                    castSpell(action.ActionData);
                    break;
                default: //unknown action
                    addMessage("Unknown action: " + action.Action, cga_whiteHex, true);
                    break;
            }
        }
    };
    hub.client.pingClient = function () {
        var connectionToken = $('#connectionToken').val();
        hub.server.ping(connectionToken).done(function (result) {
            if (result == "ok") {
                //addMessage("pingback ok");
            }
            else {
                addMessage("something blew up - " + result, cga_whiteHex, true);
            }
        });
    };
    hub.client.refreshPlayerList = refreshPlayerList;
        
    
    $('#sendmessage').click(function () {
        sendMessage();
    });


    $('#txtStrengthValue').blur(function () {
        checkStats();
    });
    $('#txtIntellectValue').blur(function () {
        checkStats();
    });
    $('#txtWillpowerValue').blur(function () {
        checkStats();
    });
    $('#txtAgilityValue').blur(function () {
        checkStats();
    });
    $('#txtHealthValue').blur(function () {
        checkStats();
    });
    $('#txtCharmValue').blur(function () {
        checkStats();
    });
    $('#btnSave').click(function () {
        saveStats();
    });

    $('#chkEnableAI').change(function () {
        if (this.checked) {
            sendMessageDirect("EnableAI");
        } else {
            sendMessageDirect("DisableAI");
        }
    })

    playerID = $('#playerID').val();

    // Set initial focus to message input box.
    $('#message').focus();
     
}