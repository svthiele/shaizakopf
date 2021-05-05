// Deck Setup

var deck;
var mitNeunen = false;
var deckInitCount;

// Players

const playerCount = 4;
var players = [];
const names = ["Fuzzi", "Lullu", "Biba", "Knabi"];
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


function startGame() {
  let initWindow = document.createElement('div');
  initWindow.className = 'init';
  initWindow.innerHTML = '<h1>Shaizakopf';
  document.body.appendChild(initWindow);

  let startGame = document.createElement('BUTTON');
  startGame.addEventListener('click', newGame);
  startGame.innerHTML = 'Spiel Starten'
  startGame.className = 'winbutton';
  document.querySelector('.init').appendChild(startGame);
  //updateTable();
}

function init() {
  for (let i = 0; i < playerCount; i++) {
    players.push(new Player(i, names[i]));
    players[i].showStats();
  }
  startGame();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', debounce(updateTable, 100));
