const sort = [
  new CardRank(1, 7),
  new CardRank(1, 11),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  new CardRank(0, 7),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9),

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),

  new CardRank(1, 8),
];

/*const sortSchweinchen = [
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
];*/

var aktStich = new Stich(0);
var ltzStich;

var countWindow;

function newGame() {
  deck = new Deck();
  deck.shuffle();
  deck.deal();

  for (let i = 0; i < players.length; i++) {
    player = players[i];
    player.hand.sort();

    for (card of player.hand.cards) {
      card.initDiv();
    }
  }

  getTeams() // asyncronous???

  whoseturn = dealer + 1;
  updateTable();
}

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
  card.div.style.filter = 'brightness(100%)';

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
  players[winner].stiche.push(stich);
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
    ansageButton.innerHTML = "Re";
  } else {
    ansageButton.innerHTML = "Kontra";
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
    ansageButton.innerHTML = "Keine " + ansage;
  } else if (teams[player.team].ansagen == 4) {
    ansageButton.innerHTML = "Schwarz";
  }
  players[me].showStats();
  ansageUpdate();
}

function gameOver() {
  var winningTeam = -1;
  var pointsNeededRe = pointsToWin(teams[0]);
  var pointsNeededKontra = pointsToWin(teams[1]);
  teamCount();

  if ((teams[0].ansagen == 0 && teams[1].ansagen == 0) || (teams[0].ansagen == 1 && teams[1].ansagen == 1)) {
    if (teams[0].points > teams[1].points) {
      console.log("Re gewinnt mit " + teams[0].points + " Punkten")
      winningTeam = 0;
    } else {
      console.log("Kontra gewinnt mit " + teams[1].points + " Punkten")
      winningTeam = 1;
    }
  } else if (teams[0].points >= pointsNeededRe) {
    console.log("Re gewinnt mit " + teams[0].points + " Punkten")
    winningTeam = 0;
  } else if (teams[1].points >= pointsNeededKontra) {
    console.log("Kontra gewinnt mit " + teams[1].points + " Punkten")
    winningTeam = 1;
  }

  for (player of players) {
    for (stich of player.stiche) {
      for (card of stich.cards) {
        card.div.remove();
      }
    }
  }

  if (winningTeam >= 0) {
    finalCount(winningTeam);
  } else {
    console.log("Unentschieden")
  }
}

function pointsToWin(team) {
  var pointsNeeded = 121;
  if (team.ansagen > 1) {
    pointsNeeded += 30 * (team.ansagen - 1);
    if (team.ansagen == 5) {
      pointsNeeded -= 1;
    }
  } else if (teams[wrapIndex(team.team + 1, 2)].ansagen >= 1) {
    pointsNeeded -= 30 * (teams[wrapIndex(team.team + 1, 2)].ansagen - 1);
    pointsNeeded -= 1;
  }

  return pointsNeeded;
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

  console.log("Gewonnen +1");

  if (losers.points < 90) {
    gamePoints += 1;
    console.log("keine 90 +1");
  }
  if (losers.points < 60) {
    gamePoints += 1;
    console.log("keine 60 +1");
  }
  if (losers.points < 30) {
    gamePoints += 1;
    console.log("keine 30 +1");
  }
  if (losers.points == 0) {
    gamePoints += 1;
    console.log("schwarz +1");
  }

  if (teams[0].ansagen > 0) {
    gamePoints += 2;
    console.log("Re angesagt +2");
  }
  if (teams[1].ansagen > 0) {
    gamePoints += 2;
    console.log("Kontra angesagt +2");
  }

  for (let i = teams[0].ansagen; i > 1; i--) {
    gamePoints += 1;
    console.log("Re: keine " + ((5 - i) * 30) + " angesagt +1");
  }

  for (let i = teams[1].ansagen; i > 1; i--) {
    gamePoints += 1;
    console.log("Kontra: keine " + ((5 - i) * 30) + " angesagt +1");
  }

  if (winners.points >= 120 && losers.ansagen >= 2) {
    gamePoints += 1;
    console.log("120 bei keine 90 abgesagt +1");
  }
  if (winners.points >= 90 && losers.ansagen >= 3) {
    gamePoints += 1;
    console.log("90 bei keine 60 abgesagt +1");
  }
  if (winners.points >= 60 && losers.ansagen >= 4) {
    gamePoints += 1;
    console.log("60 bei keine 30 abgesagt +1");
  }
  if (winners.points >= 30 && losers.ansagen == 5) {
    gamePoints += 1;
    console.log("30 bei schwarz abgesagt +1");
  }

  if (winningTeam == 1) { //gegen die Alten
    gamePoints += 1;
    console.log("gegen die Alten +1");
  }

  for (sonderPunkt of winners.sonderpunkte) {
    if (sonderPunkt == 'F') {
      gamePoints += 1;
      console.log("Fuchs gefangen +1");
    }
    if (sonderPunkt == 'DK') {
      gamePoints += 1;
      console.log("Shaizakopf +1");
    }
    if (sonderPunkt == 'KG') {
      gamePoints += 1;
      console.log("Karlchen Gefangen +1");
    }
    if (sonderPunkt == 'KL') {
      gamePoints += 1;
      console.log("Karlchen im Letzten +1");
    }
  }

  for (sonderPunkt of losers.sonderpunkte) {
    if (sonderPunkt == 'F') {
      gamePoints -= 1;
      console.log("Fuchs gefangen -1");
    }
    if (sonderPunkt == 'DK') {
      gamePoints -= 1;
      console.log("Shaizakopf -1");
    }
    if (sonderPunkt == 'KG') {
      gamePoints -= 1;
      console.log("Karlchen Gefangen -1");
    }
    if (sonderPunkt == 'KL') {
      gamePoints -= 1;
      console.log("Karlchen im Letzten -1");
    }
  }

  console.log("Gewinner erhalten: " + gamePoints);

  return gamePoints
}

function teamCount() {
  for (team of teams) {
    for (player of team.players) {
      team.points += player.points;
    }
  }
}

function testScenario(re, kontra, ansageRe, ansageKontra, reSp, koSp) {
  teams[0].points = re;
  teams[1].points = kontra;
  teams[0].ansagen = ansageRe;
  teams[1].ansagen = ansageKontra;
  teams[0].sonderpunkte = reSp;
  teams[1].sonderpunkte = koSp;

  gameOver();
}
