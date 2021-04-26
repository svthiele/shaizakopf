// Deck Setup

var deck;
var mitNeunen = false;
var deckInitCount;

// Players

const playerCount = 4;
var players = [];
const names = ["Lullu", "Biba", "Knabi", "Fuzzi"];
var teams = [new Team(0), new Team(1)];
var me = 0;

var dealer = 0;
var whoseturn;
var order = 0;
var stiche = 0;

// DOM Elements

var ansageButton;

// card displays

var cardH = window.innerHeight / 6;
var cardW = cardH * 0.8;
var cardBackImg;


function setup() {
  //createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < playerCount; i++) {
    players.push(new Player(i, names[i]));
  }

  createGUI();
  newGame();
}

function draw() {
    updateTable();
    noLoop();
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

function init() {
  let initWindow = createDiv();
}
