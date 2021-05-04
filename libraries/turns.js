var aktStich = new Stich(0);
var ltzStich;

var vorbehaltRunde = true;
var vorbehalteCount = 0;

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
  card.div.className = 'card';
  card.div.style.zIndex = String(order);

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
  stichWin(aktStich); // async!
  aktStich.take();
  ltzStich = aktStich;
  aktStich = new Stich(0);
  order = 0;
  whoseturn = ltzStich.winner;

  updateTable();

  if (hochzeitVorbehalt && stiche <= 3) {
    klaerungsStich()
  }

  if (stiche == deckInitCount / playerCount) {
    gameOver();
  }
}

function klaerungsStich() {
  if ((stiche <= 3) && (teams[0].players.length == 1) && (ltzStich.winner != teams[0].players[0].num)) { //Klärungsstich
    teams[0].players.push(players[ltzStich.winner]);
    for (var i = 0; i < teams[1].players.length; i++) {
      if (teams[1].players[i].num == ltzStich.winner) {
        teams[1].players.splice(i, 1);
      }
    }
  } else if ((stiche == 3) && (teams[0].players.length == 1)) {
    console.log("Farbsolo Karo");
    solo = teams[0].players[0].num;
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
