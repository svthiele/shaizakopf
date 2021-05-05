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
  }

  for (let i = 0; i < stich.count; i++) {
    if (stich.cards[i].fuchs && (players[stich.winner].team != players[stich.cards[i].player].team)) {
      teams[players[stich.winner].team].sonderpunkte.push('F');
    }
  }

  if (stiche == (deckInitCount / playerCount)) {
    for (let i = 0; i < stich.count; i++) {
      if (stich.cards[i].karlchen) {
        if ((players[stich.winner].team != players[stich.cards[i].player].team)) {
          teams[players[stich.winner].team].sonderpunkte.push('KG');
        } else if (stich.winner == stich.cards[i].player) {
          teams[players[stich.winner].team].sonderpunkte.push('KL');
        }
      }
    }
  }
}

function finalCount(winningTeam) {
  var winners = teams[winningTeam];
  var losers = teams[wrapIndex(winningTeam + 1, 2)];
  var gamePoints = 1;

  let message = "";

  message += "Gewonnen +1<br>";

  if (losers.points < 90) {
    gamePoints += 1;
    message += "keine 90 +1<br>";
  }
  if (losers.points < 60) {
    gamePoints += 1;
    message += "keine 60 +1<br>";
  }
  if (losers.points < 30) {
    gamePoints += 1;
    message += "keine 30 +1<br>";
  }
  if (losers.points == 0) {
    gamePoints += 1;
    message += "schwarz +1<br>";
  }

  if (teams[0].ansagen > 0) {
    gamePoints += 2;
    message += "Re angesagt +2<br>";
  }
  if (teams[1].ansagen > 0) {
    gamePoints += 2;
    message += "Kontra angesagt +2<br>";
  }

  for (let i = teams[0].ansagen; i > 1; i--) {
    gamePoints += 1;
    message += "Re: keine " + ((5 - i) * 30) + " angesagt +1<br>";
  }

  for (let i = teams[1].ansagen; i > 1; i--) {
    gamePoints += 1;
    message += "Kontra: keine " + ((5 - i) * 30) + " angesagt +1<br>";
  }

  if (winners.points >= 120 && losers.ansagen >= 2) {
    gamePoints += 1;
    message += "120 bei keine 90 abgesagt +1<br>";
  }
  if (winners.points >= 90 && losers.ansagen >= 3) {
    gamePoints += 1;
    message += "90 bei keine 60 abgesagt +1<br>";
  }
  if (winners.points >= 60 && losers.ansagen >= 4) {
    gamePoints += 1;
    message += "60 bei keine 30 abgesagt +1<br>";
  }
  if (winners.points >= 30 && losers.ansagen == 5) {
    gamePoints += 1;
    message += "30 bei schwarz abgesagt +1<br>";
  }

  if (teams[0].players.length != 1) { // Nur wenn keine Solo gespielt wurde
    if (winningTeam == 1) { //gegen die Alten
      gamePoints += 1;
      message += "gegen die Alten +1<br>";
    }

    for (let sonderPunkt of winners.sonderpunkte) {
      if (sonderPunkt == 'F') {
        gamePoints += 1;
        message += "Fuchs gefangen +1<br>";
      }
      if (sonderPunkt == 'DK') {
        gamePoints += 1;
        message += "Shaizakopf +1<br>";
      }
      if (sonderPunkt == 'KG') {
        gamePoints += 1;
        message += "Karlchen Gefangen +1<br>";
      }
      if (sonderPunkt == 'KL') {
        gamePoints += 1;
        message += "Karlchen im Letzten +1<br>";
      }
    }

    for (let sonderPunkt of losers.sonderpunkte) {
      if (sonderPunkt == 'F') {
        gamePoints -= 1;
        message += "Fuchs gefangen -1<br>";
      }
      if (sonderPunkt == 'DK') {
        gamePoints -= 1;
        message += "Shaizakopf -1<br>";
      }
      if (sonderPunkt == 'KG') {
        gamePoints -= 1;
        message += "Karlchen Gefangen -1<br>";
      }
      if (sonderPunkt == 'KL') {
        gamePoints -= 1;
        message += "Karlchen im Letzten -1<br>";
      }
    }
  }
  message += "Gewinner erhalten: " + gamePoints;

  popUp(message);

  if (teams[0].players.length == 1) { // wenn Solist gewonnen
    if (winners.team == 0) {
      winners.players[0].gamePoints += gamePoints * 3;
      for (let loser of losers.players) {
        loser.gamePoints -= gamePoints;
      }
    } else {
      losers.players[0].gamePoints -= gamePoints * 3;
      for (let winner of winner.players) {
        winner.gamePoints += gamePoints;
      }
    }
  } else {
    for (let loser of losers.players) {
      loser.gamePoints -= gamePoints;
    }
    for (let winner of winners.players) {
      winner.gamePoints += gamePoints;
    }
  }
}

function teamCount() {
  for (let team of teams) {
    for (let player of team.players) {
      team.points += player.points;
    }
  }
}
