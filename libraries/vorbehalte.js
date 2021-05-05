const soli = ['SKa', 'SHe', 'SPi', 'SKr', 'SAs', 'SD', 'SB'];
const soliLabel = ['Karo Solo', 'Herz Solo', 'Pik Solo', 'Kreuz Solo', 'Fleischlos', 'Damensolo', 'Bubensolo'];
let hochzeitVorbehalt = false;

async function vorbehalte() {
  var results = [];
  let spiel = '';

  for (let i = 0; i < playerCount; i++) {
    let player = wrapIndex(i + whoseturn, playerCount);
    results.push(await vorbehaltWindow(player));
  }

  for (let i = 0; i < playerCount; i++) {
    let vorbehalt = results[i].vorbehalt;
    if (vorbehalt != '') {
      if (spiel.charAt(0) != 'S') {
        spiel = vorbehalt;
        solist = results[i].player;
      }
    }
  }


  switch (spiel.charAt(0)) {
    case 'S': // Solo wird gespielt

      let soloString = soliLabel[soli.indexOf(spiel)];
      popUp(players[solist].name + ' spielt ein ' + soloString);

      trumpIndex = eval('trumpIndexList.' + spiel);
      sort = eval('sort' + spiel);

      teams[0].players = [players[solist]];
      teams[1].players = [];
      for (let i = 0; i < playerCount - 1; i++) {
        teams[1].players.push(players[wrapIndex(solist + 1 + i, playerCount)]);
      }
      whoseturn = solist;

      break;

    case 'H': // Hochzeit wird gespielt

      popUp(players[solist].name + ' spielt eine Hochzeit');
      hochzeitVorbehalt = true;
      break;

    case 'A': // Armut angemeldet

      popUp(players[solist].name + ' hat Armut angemeldet');
      armut();
      break;

    default:

      popUp('Normalspiel');

      break;
  }

  for (let player of players) {
    player.hand.sort(sort);
  }

  createAnsageButton();
  updateTable();
}

function vorbehaltWindow(player) {
  let result = {};

  let vorbehaltDiv = document.createElement('div');
  vorbehaltDiv.className = 'vorbehaltWindow';
  vorbehaltDiv.innerHTML = "<h1>" + players[player].name + ", Vorbehalt wählen:";


  //if (player == me) {
  document.body.appendChild(vorbehaltDiv);
  //}

  return new Promise(resolve => {
    if (hochzeit && players[player].team == 0) {
      let hochzeitBut = document.createElement('button');
      hochzeitBut.innerHTML = 'Hochzeit';
      hochzeitBut.className = 'winbutton';
      hochzeitBut.addEventListener('click', function(e) {
        vorbehaltDiv.remove();
        players[player].stats.innerHTML += '<br>Vorbehalt';
        result.vorbehalt = 'H';
        result.player = player;
        resolve(result);
      });
      vorbehaltDiv.appendChild(hochzeitBut);
    }

    for (let i = 0; i < soli.length; i++) {
      let button = document.createElement('button');
      button.innerHTML = soliLabel[i];
      button.className = 'winbutton';
      button.addEventListener('click', e => {
        vorbehaltDiv.remove();
        players[player].stats.innerHTML += '<br>Vorbehalt';
        result.vorbehalt = soli[i];
        result.player = player;
        resolve(result);
      });
      button.addEventListener('mouseenter', e => {
        players[player].hand.sort(eval('sort' + soli[i]));
        players[player].display();
      });
      button.addEventListener('mouseleave', e => {
        players[player].hand.sort(sort);
        players[player].display();
      });
      vorbehaltDiv.appendChild(button);
    }

    if (players[player].hand.trumpCount <= 3) {
      let armut = document.createElement('button');
      armut.innerHTML = 'Armut';
      armut.className = 'winbutton';
      armut.addEventListener('click', e => {
        vorbehaltDiv.remove();
        players[player].stats.innerHTML += '<br>Vorbehalt';
        result.vorbehalt = 'A';
        result.player = player;
        resolve(result);
      });
      vorbehaltDiv.appendChild(armut);
    }
    let keinVorbehalt = document.createElement('button');
    keinVorbehalt.innerHTML = 'Kein Vorbehalt';
    keinVorbehalt.className = 'winbutton';
    keinVorbehalt.addEventListener('click', e => {
      vorbehaltDiv.remove();
      players[player].stats.innerHTML += '<br>Gesund';
      result.vorbehalt = '';
      result.player = player;
      resolve(result);
    });
    vorbehaltDiv.appendChild(keinVorbehalt);

  })
}

function armut() {

}
