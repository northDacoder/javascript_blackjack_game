$(document).ready(function() {  // Start of document ready handler
    console.log("Document ready loaded");
    $("#btn-hit", "#btn-stand").hide();
  
    if (!initGame()) {
        $("#btn-new").attr('disabled', 'disabled');  // <Any id="btn-new" disabled="disabled">
        return;
    }
    
    $("#btn-new").click(function() {
        newGame();
    });
    
    $("#btn-hit").click(function (){
        var playerHand = JSON.parse(localStorage.getItem('playerHand'));
        playerHand.push(dealCard());
        localStorage.setItem('playerHand', JSON.stringify(playerHand));
        displayPlayerHand();
    });
}); // End of document ready handler 

// function to initialize the game when everything required has been loaded
function initGame() {

    // Check dependencies 
    console.log(initGame.name);
    var initError = [];
    var errorMessage = '';

    // Is modernizr available?
    if (!Modernizr.localstorage) {
        errorMessage = 'Local storage not available';
        initError.push(errorMessage);
    }

    if (typeof Mustache === 'undefined') {
        errorMessage = 'Mustache not laoded';
        initError.push(errorMessage);
    }

    // Test to see if initError array has any erros in it
    if (initError.length) {

        errorMessage = 'Houston, we have a problem! (';

        $.each(initErrors, function(index, value) {
            errorMessage += ',' + value;
        });

        errorMessage =+ ')';

        displayStatusMessage(errorMessage);

        return false;
    }

    // If no errors are found then return true & initialize the game!!
    displayStatusMessage("Ready to play? Click 'New Game' to start...");
    $("#btn-new").removeAttr('disabled');
    $(".hand").html('');

    return true;
}

// function to display status of the game 
function displayStatusMessage(msg) {
    console.log(displayStatusMessage.name);
    $("#status").html(msg);
}

/* Start a new game */
// function to create a new game
function newGame() {
    console.log(newGame.name);

    // Get the shoe
    getShoe(1);

    // Deal starting hands & display the cards
    dealHands();
    displayDealerHand(false); // Dealer's hand only shows one card
    displayPlayerHand();

    // Show the Hit & Stand buttons
    $("#btn-hit", "#btn-stand").show();

    displayStatusMessage('Game in progress...');
    displayDealerScore('Dealer');

    // Check whether player got a blackjack
    if (localStorage.getItem('playerHandValue') === 21) {
        localStorage.setItem('playerHandValue', 'blackjack');
        playDealerHand();
    }
}

// function to get the "shoe" of cards
function getDeck() {
  console.log(getDeck.name);
  var deck = [
    // Cards with Hearts suit
    {suit: "H", face: "A"},
    {suit: "H", face: 2},
    {suit: "H", face: 3},
    {suit: "H", face: 4},
    {suit: "H", face: 5},
    {suit: "H", face: 6},
    {suit: "H", face: 7},
    {suit: "H", face: 8},
    {suit: "H", face: 9},
    {suit: "H", face: 10},
    {suit: "H", face: "J"},
    {suit: "H", face: "Q"},
    {suit: "H", face: "K"},

    // Cards with Spades suit
    {suit: "S", face: "A"},
    {suit: "S", face: 2},
    {suit: "S", face: 3},
    {suit: "S", face: 4},
    {suit: "S", face: 5},
    {suit: "S", face: 6},
    {suit: "S", face: 7},
    {suit: "S", face: 8},
    {suit: "S", face: 9},
    {suit: "S", face: 10},
    {suit: "S", face: "J"},
    {suit: "S", face: "Q"},
    {suit: "S", face: "K"},

    // Cards with Diamonds suit
    {suit: "D", face: "A"},
    {suit: "D", face: 2},
    {suit: "D", face: 3},
    {suit: "D", face: 4},
    {suit: "D", face: 5},
    {suit: "D", face: 6},
    {suit: "D", face: 7},
    {suit: "D", face: 8},
    {suit: "D", face: 9},
    {suit: "D", face: 10},
    {suit: "D", face: "J"},
    {suit: "D", face: "Q"},
    {suit: "D", face: "K"},

    // Cards with Clubs suit
    {suit: "C", face: "A"},
    {suit: "C", face: 2},
    {suit: "C", face: 3},
    {suit: "C", face: 4},
    {suit: "C", face: 5},
    {suit: "C", face: 6},
    {suit: "C", face: 7},
    {suit: "C", face: 8},
    {suit: "C", face: 9},
    {suit: "C", face: 10},
    {suit: "C", face: "J"},
    {suit: "C", face: "Q"},
    {suit: "C", face: "K"}
  ];
  return deck;
}

// function to get the deck of cards
function getShoe(decks) {
    console.log(getShoe.name);
    var shoe = [];

    for (var i = 0; i < decks; i++) {
        shoe.push(getDeck());
    }
    
    shoe = shuffle(shoe);
    localStorage.setItem("shoe", shoe);
}

// function to take shoe array & shuffle the cards before setting to local storage
function shuffle(array) {
    console.log(shuffle.name);
    for (var j, x, i = array.length; i; j = parseInt(Math.random() * i, 10), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
}

function dealCard() {
    console.log(dealCard.name);
    var myDecks = localStorage.getItem("shoe");
    myDecks.splice(0, 1);
    console.log(myDecks);
    card = [card.suit, card.face];
  
    var cardImage = function(card){
        console.log(cardImage.name);

        var suit = card.suit;
        var number = 0;
    
        if (card.face === "A") {
            number = 1;
        }
        if (card.face === "J") {
            number = 11;
        }
        if (card.face === "Q") {
            number = 12;
        }
        if (card.face === "K") {
            number = 13;
        }
        if (card.face > 1 && card.face <= 10) {
            number = card.face;
            suit = card.suit + "0";
        }

      var urlStr = "images/cards/";
      var ext = ".png";
      var location = urlStr + suit + number + ext;
      return location;
    };
  
    var cardValue = 0;
  
    if (card.face === "A") {
        cardValue = 1;
    }
    if (card.face > 1 && card.face <= 10) {
        cardValue = card.face;
    }
  
    if (card.face === "J" || card.face === "Q" || card.face === "K") {
        cardValue = 10;
    }

    localStorage.setItem("shoe", shoe);
    var imageValue = {"image": location, "value": cardValue};
    return imageValue;
}

function dealHands() {
    console.log(dealHands.name);
    var dealerHand = [dealCard(), dealCard()];
    var playerHand = [dealCard(), dealCard()];
    localStorage.setItem("dealerHand", dealerHand);
    localStorage.setItem("playerHand", playerHand);
}

function displayDealerHand(reveal) {
    console.log(displayDealerHand.name);
    var dealerArray = localStorage.getItem("dealerHand");
    var hand = {};
    if (reveal === true) {
        hand = {"cards": dealerArray};
    } else {
        hand = {
          "cards": dealerArray[0],
          "back": true
        };
    }
  
    var html = Mustache.render(template, hand);
    $("#dealer-hand").append(html);
}

function displayPlayerHand() {
    console.log(displayPlayerHand.name);
    var hand = localStorage.getItem("playerHand");
    var html = Mustache.render(template, hand);
    $("#player-hand").append(html);
}

function displayStatusMessage(msg) {
    console.log(displayStatusMessage.name);
    $("#status").append(msg);
}
























