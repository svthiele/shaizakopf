function updateTable() {
  for (let player of players) {
    player.display();
    player.showStats();
  }
  ansageUpdate();
  aktStich.display();
}

function ansageUpdate() {
  if (players[me].ansagen == 5) {
    ansageButton.style.display = 'none';
  }

  if (players[me].hand.count + players[me].ansagen < (deckInitCount / playerCount) - 1) {
    ansageButton.style.display = 'none';
  }
}

function createAnsageButton() {
  ansageButton = document.createElement('BUTTON');
  document.body.appendChild(ansageButton);
  ansageButton.style.position = 'absolute';
  ansageButton.style.left = '35%';
  ansageButton.style.top = '75%';
  ansageButton.style.display = 'none';
  ansageButton.className = 'button';
  ansageButton.addEventListener('click', function() {
    ansageMachen(players[me]);
  });

  if (players[me].team == 0) {
    ansageButton.innerHTML = "Re";
  } else {
    ansageButton.innerHTML = "Kontra";
  }
}

function popUp(message) {
  let popUp = document.createElement('div');
  popUp.className = 'popUp';
  popUp.innerHTML = message;
  document.body.appendChild(popUp);
  setTimeout(function() {
    popUp.remove();
  }, 4000)
}
