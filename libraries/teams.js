function getTeams() {
  for (let i = 0; i < playerCount; i++) {
    var re = false;
    for (let chkCard of players[i].hand.cards) {
      if (chkCard.krDame) {
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

  if (teams[0].players.length < 2) {
    hochzeit = true;
  }
}

function ansageMachen(player) {
  teams[player.team].ansagen += 1;
  player.ansagen = teams[player.team].ansagen;

  for (let otherPlayer of teams[player.team].players) {
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
