function updateTable() {
  for (player of players) {
    player.display();
    player.showStats();
  }
  aktStich.display();
}

function ansageUpdate() {
  if (players[me].ansagen == 5 ) {
    ansageButton.remove();
  }

  if (players[me].hand.count + players[me].ansagen < (deckInitCount / playerCount) - 1 ) {
    ansageButton.remove();
  }
}

function createGUI () {
  ansageButton = document.createElement('BUTTON');
  document.body.appendChild(ansageButton);
  ansageButton.style.position = 'absolute';
  ansageButton.style.left = '35%';
  ansageButton.style.top = '75%';
  ansageButton.addEventListener('click', function() {
    ansageMachen(players[me]);
  });
}
