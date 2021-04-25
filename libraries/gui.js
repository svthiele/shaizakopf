function displayGui() {
  showStats();
  showTurn();
  ansageUpdate();
}

function showStats() {
  for (let i = 0; i < playerCount; i++) {
    var x = 0;
    var y = 0;

    switch (displayPos(i)) {
      case 0:
        x = width / 2;
        y = height * 0.75;
        break
      case 1:
        x = width * 0.25;
        y = height / 2;
        break
      case 2:
        x = width / 2;
        y = height * 0.25;
        break
      case 3:
        x = width * 0.75;
        y = height / 2;
        break
    }

    players[i].stats.position(x, y);
    players[i].stats.html(players[i].name);
    //players[i].stats.html(": " + players[i].points, true);
    players[i].stats.html('<br>', true);
    if (players[i].ansagen > 0) {
      if (players[i].team == 0) {
        players[i].stats.html("Re", true);
      } else {
        players[i].stats.html("Kontra", true);
      }
    }
    if (players[i].ansagen >= 2 && players[i].ansagen < 5) {
      var ansage = 90 - ((players[i].ansagen - 2) * 30);
      players[i].stats.html(" keine " + String(ansage), true);
    }
    if (players[i].ansagen == 5) {
      players[i].stats.html(" schwarz", true);
    }

    ansageButton.position(width * 0.25, height * 0.75);

    showTurn();
  }
}

function showTurn() {
  players[whoseturn].stats.style('background', 'lightgrey');
  for (let i = 1; i < 4; i++) {
    players[(whoseturn + i) % 4].stats.style('background', 'none');
  }
}

function positions() {
  for (let i = 0; i < playerCount; i++) {
    players[i].pos = displayPos(i);
  }
}

function ansageUpdate() {
  if (players[me].ansagen == 5 ) {
    ansageButton.remove();
  }

  if (players[me].hand.count + players[me].ansagen < (deckInitCount / playerCount) - 1 ) {
    ansageButton.remove();
  }

}
