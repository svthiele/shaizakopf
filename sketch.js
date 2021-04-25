var deck;
var players = [];
var points = [0, 0, 0, 0]
const playerCount = 4;
var mitNeunen = true;
var deckInitCount;
const names = ["Lullu", "Biba", "Knabi", "Fuzzi"];
var teams = [new Team(0), new Team(1)];

var me = 0;

var dealer = 0;
var whoseturn;
var order = 0;
var stiche = 0;

let ansageButton;

var cardH = window.innerHeight / 6;
var cardW = cardH * 0.8;
const cardImgValue = ['9', 'T', 'J', 'Q', 'K', 'A'];
const cardImgSuits = ['D', 'H', 'S', 'C'];
var cardImgs = [
  [],
  [],
  [],
  []
];
var cardBackImg;

function preload() {
  for (let suit = 0; suit < 4; suit++) {
    for (let value = 0; value < cardImgValue.length; value++) {
      cardImgs[suit][value] = loadStrings('data/cards/' + cardImgValue[value] + cardImgSuits[suit] + '.svg');
    }
  }
  cardBackImg = loadStrings('data/cards/1B.svg');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  for (let i = 0; i < playerCount; i++) {
    players.push(new Player(names[i]));
  }

  ansageButton = createButton('');
  ansageButton.elt.addEventListener('click', function() {
    ansageMachen(players[me])
  });

  newGame();

  positions();
}

function draw() {
  updateTable();
  noLoop();
}

function newGame() {
  deck = new Deck();
  deck.shuffle();
  deck.deal();

  for (let i = 0; i < players.length; i++) {
    player = players[i];
    player.hand.sort();

    for (c = 0; c < player.hand.cards.length; c++) {
      let card = player.hand.cards[c];
      card.div = createDiv(cardImgs[card.suit][card.value - 7][1]);
      card.div.size(cardW, cardH);
      card.div.elt.addEventListener('click', function() {
        legalMove(card);
      });
      card.div.elt.addEventListener('mouseenter', function() {
        if (card.player == me && card.inHand) {
          this.style.filter = 'brightness(85%)';
        }
      });
      card.div.elt.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(100%)';
      });
    }

    player.stats = createDiv(player.name);
  }

  getTeams()

  if (me.team == 0) {
    ansageButton.html('Re');
  } else if (me.team == 1) {
    ansageButton.html('Kontra');
  }

  ansageButton.position(width * 0.25, height * 0.75);

  whoseturn = dealer + 1;
}

function updateTable() {
  for (let i = 0; i < playerCount; i++) {
    players[i].display();
  }

  displayGui();
  aktStich.display();
}

function windowResized() {
  cardH = window.innerHeight / 6;
  cardW = cardH * 0.8;

  resizeCanvas(windowWidth, windowHeight);
}

function wrapIndex(i, i_max) {
  i = i % i_max;
  return (i < 0 ? i + i_max : i);
}
