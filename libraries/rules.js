var hochzeit = false;
var sort = sortStd;

function newGame() {
  deck = new Deck();
  deck.shuffle();
  deck.deal();

  for (let player of players) {
    player.hand.sort(sort);
    player.display();
    player.showStats();
  }

  getTeams()

  whoseturn = dealer + 1;
  document.querySelector('.init').remove();
  vorbehalte();
}

function gameOver() {
  var winningTeam = -1;
  var pointsNeededRe = pointsToWin(teams[0]);
  var pointsNeededKontra = pointsToWin(teams[1]);
  let message;

  teamCount();

  if ((teams[0].ansagen == 0 && teams[1].ansagen == 0) || (teams[0].ansagen == 1 && teams[1].ansagen == 1)) {
    if (teams[0].points > teams[1].points) {
      message = "Re gewinnt mit " + teams[0].points + " Punkten";
      winningTeam = 0;
    } else {
      message = "Kontra gewinnt mit " + teams[1].points + " Punkten";
      winningTeam = 1;
    }
  } else if (teams[0].points >= pointsNeededRe) {
    message = "Re gewinnt mit " + teams[0].points + " Punkten";
    winningTeam = 0;
  } else if (teams[1].points >= pointsNeededKontra) {
    message = "Kontra gewinnt mit " + teams[1].points + " Punkten";
    winningTeam = 1;
  }

  popUp(message)

  for (let player of players) {
    for (let stich of player.stiche) {
      for (let card of stich.cards) {
        card.div.remove();
      }
    }
  }

  if (winningTeam >= 0) {
    finalCount(winningTeam);
  } else {
    popUp("Unentschieden")
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
