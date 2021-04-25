const sort = [
  new PlayingCard(1, 7),
  new PlayingCard(1, 11),
  new PlayingCard(1, 12),

  new PlayingCard(2, 7),
  new PlayingCard(2, 11),
  new PlayingCard(2, 8),
  new PlayingCard(2, 12),

  new PlayingCard(3, 7),
  new PlayingCard(3, 11),
  new PlayingCard(3, 8),
  new PlayingCard(3, 12),

  new PlayingCard(0, 7),
  new PlayingCard(0, 11),
  new PlayingCard(0, 8),
  new PlayingCard(0, 12),

  new PlayingCard(0, 9),
  new PlayingCard(1, 9),
  new PlayingCard(2, 9),
  new PlayingCard(3, 9),

  new PlayingCard(0, 10),
  new PlayingCard(1, 10),
  new PlayingCard(2, 10),
  new PlayingCard(3, 10),

  new PlayingCard(1, 8),
];

const sortSchweinchen = [
  new PlayingCard(1, 11),
  new PlayingCard(1, 12),

  new PlayingCard(2, 11),
  new PlayingCard(2, 8),
  new PlayingCard(2, 12),

  new PlayingCard(3, 11),
  new PlayingCard(3, 8),
  new PlayingCard(3, 12),

  new PlayingCard(0, 11),
  new PlayingCard(0, 8),

  new PlayingCard(0, 9),
  new PlayingCard(1, 9),
  new PlayingCard(2, 9),
  new PlayingCard(3, 9),

  new PlayingCard(0, 10),
  new PlayingCard(1, 10),
  new PlayingCard(2, 10),
  new PlayingCard(3, 10),

  new PlayingCard(1, 8),
  new PlayingCard(0, 12) // Schweinchen
];

var aktStich = new Stich(0);
var ltzStich;

function legalMove(card) {
  var player = card.player;
  var cardTrumpFehl = card.trumpFehl(); // Trumpf oder welche Fehl

  if (player == whoseturn) {
    if (order == 0) { // if its the first card to be played
      aktStich.suit = cardTrumpFehl;
      aktStich.first = whoseturn;
      playCard(card, player);
    } else {
      if (cardTrumpFehl == aktStich.suit) { //Passende Farbe oder Trumpf
        playCard(card, player);
      } else if (!(players[player].hand.hasSuit(aktStich.suit))) {
        playCard(card, player);
      }
    }
  }
}

function playCard(card, player) {
  aktStich.add(card);
  players[player].hand.remove(card);
  card.div.elt.style.filter = 'brightness(100%)';

  if (aktStich.count == 4) {
    setTimeout(stichVoll, 2000);
  } else {
    whoseturn = (whoseturn + 1) % playerCount;
    order += 1;
  }
  updateTable();
}

function stichVoll() {
  stiche += 1;
  stichWin(aktStich)
  aktStich.take();
  ltzStich = aktStich;
  aktStich = new Stich(0);
  order = 0;
  whoseturn = ltzStich.winner;

  updateTable();

  if (stiche == deckInitCount / playerCount) {
    gameOver();
  }
}

function stichWin(stich) {
  var winner = 0;
  for (var i = 0; i < aktStich.count; i++) {
    var winCard = aktStich.cards[winner];
    var chkCard = aktStich.cards[i];
    if (winCard.isTrump() && chkCard.isTrump()) { //both cards are trump -> compare their value
      if (winCard.sortPos() < chkCard.sortPos()) {
        winner = i;
      }
      if (winCard.dulle && chkCard.dulle && stiche < (deckInitCount / playerCount)) {
        winner = i;
      }
    } else if (!(winCard.isTrump())) {
      if (chkCard.isTrump()) { //winning card is not trump -> new trump card wins
        winner = i;
      } else if (!(chkCard.isTrump()) && chkCard.suit == aktStich.suit) { //neither cards are trump, so check their values
        if (winCard.sortPos() < chkCard.sortPos()) {
          winner = i;
        }
      }
    }
  }

  winner = (winner + stich.first) % 4;
  stich.winner = winner;
  sonderPunkte(stich);
  players[winner].points += stich.points;

  return winner;
}

function getTeams() {
  for (let i = 0; i < playerCount; i++) {
    var re = false;
    for (let j = 0; j < players[i].hand.cards.length; j++) {
      if (players[i].hand.cards[j].krDame) {
        re = true;
      }
    }
    if (re) {
      teams[0].players.push(players[i]);
      players[i].team = 0;
    } else {
      teams[1].players.push(players[i]);
      players[i].team = 1;
    }
  }

  if (players[me].team == 0) {
    ansageButton.html("Re");
  } else {
    ansageButton.html("Kontra");
  }

  if (teams[0].players.length < 2) {
    console.log("Hochzeit!");
  }
}

function ansageMachen(player) {
  teams[player.team].ansagen += 1;
  player.ansagen = teams[player.team].ansagen;

  for (otherPlayer of teams[player.team].players) {
    if (!(otherPlayer === player) && otherPlayer.ansagen > 0) {
      otherPlayer.ansagen = teams[player.team].ansagen;
    }
  }

  if (teams[player.team].ansagen >= 1 && teams[player.team].ansagen < 4) {
    var ansage = 90 - ((teams[player.team].ansagen - 1) * 30);
    ansageButton.html("Keine " + ansage);
  } else if (teams[player.team].ansagen == 4) {
    ansageButton.html("Schwarz");
  }

  displayGui();
}

function gameOver() {
  var winningTeam = 0;
  teamCount();

  if (teams[0].points > teams[1].points) {
    console.log("Re gewinnt mit " + rePartei + " Punkten")
    winningTeam = 0;
  } else {
    console.log("Kontra gewinnt mit " + koPartei + " Punkten")
    winningTeam = 1;
  }

  finalCount(winningTeam);
}

function sonderPunkte(stich) {
  if (stich.points >= 40) {
    teams[players[stich.winner].team].sonderpunkte.push('DK');
    console.log("Shaizakopf!");
  }

  for (let i = 0; i < stich.count; i++) {
    if (stich.cards[i].fuchs && (players[stich.winner].team != players[stich.cards[i].player].team)) {
      teams[players[stich.winner].team].sonderpunkte.push('F');
      console.log("Fuchhhs!");
    }
  }

  if (stiche == (deckInitCount / playerCount)) {
    for (let i = 0; i < stich.count; i++) {
      if (stich.cards[i].karlchen) {
        if ((players[stich.winner].team != players[stich.cards[i].player].team)) {
          teams[players[stich.winner].team].sonderpunkte.push('KG');
          console.log("Karlchen gefangen!");
        } else if (stich.winner == stich.cards[i].player) {
          teams[players[stich.winner].team].sonderpunkte.push('KL');
          console.log("Karlchen im letzten!");
        }
      }
    }
  }
}

function finalCount(winningTeam) {
  var winners = teams[winningTeam];
  var losers = teams[wrapIndex(winningTeam + 1, 2)];
  var gamePoints = 1;

  if (winningTeam == 1) { //gegen die Alten
    gamePoints += 1;
  }

  gamePoints += winners.sonderpunkte.length();
  gamePoints -= losers.sonderpunkte.length();

  for (player of winners.players) {
    player.gamePoints += gamePoints;
  }
  for (player of losers.players) {
    winners.gamePoints -= gamePoints;
  }
}

function teamCount() {
  for (team of teams) {
    for (player of team.players) {
      team.points += player.points;
    }
  }
}
