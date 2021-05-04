class Player {
  constructor(num, name) {
    this.num = num;
    this.hand = new Hand;
    this.team = -1; // 0 = re 1 = kontra
    this.pos = displayPos(this.num);
    this.name = name;
    this.points = 0;
    this.gamePoints = 0;
    this.ansagen = 0;
    this.vorbehalt = ''; // H = Hochzeit, A = Armut, S* = Solo -> SKa, SHe, SPi, SKr, SAs
    this.stiche = [];
    this.initDiv();
  }

  display() {
    this.hand.display(this.pos);
  }

  initDiv() {
    var left = 0;
    var top = 0;

    this.stats = document.createElement('div');
    document.body.appendChild(this.stats);

    this.stats.style.position = 'absolute';
    this.stats.className = 'stats';

    switch (displayPos(this.num)) {
      case 0:
        left = '50%'; //width / 2;
        top = '70%'; //height * 0.75;
        break
      case 1:
        left = '15%'; //width * 0.25;
        top = '50%'; //height / 2;
        break
      case 2:
        left = '50%'; //width / 2;
        top = '20%'; //height * 0.25;
        break
      case 3:
        left = '85%'; //width * 0.75;
        top = '50%'; //height / 2;
        break
    }

    this.stats.style.top = top;
    this.stats.style.left = left;

  }

  showStats() {
    this.stats.innerHTML = this.name;
    //players[i].stats.html(": " + players[i].points, true);
    this.stats.innerHTML += '<br>';
    if (this.ansagen > 0) {
      if (this.team == 0) {
        this.stats.innerHTML += "<a class='ansage'>Re";
      } else {
        this.stats.innerHTML += "<a class='ansage'>Kontra";
      }
    }
    if (this.ansagen >= 2 && this.ansagen < 5) {
      var ansage = 90 - ((this.ansagen - 2) * 30);
      this.stats.innerHTML += "<a class='ansage'> keine " + String(ansage);
    }
    if (this.ansagen == 5) {
      this.stats.innerHTML += "<a class='ansage'> schwarz";
    }

    //this.stats.innerHTML += '</a>'

    if (whoseturn == this.num) {
      this.stats.className = 'activeStats';
    } else {
      this.stats.className = 'stats';
    }
  }
}

class Team {
  constructor(team) {
    this.team = team; // 0 = re, 1 = Kontra
    this.ansagen = 0; // re/konta = 1, keine 9 = 2, keine 6 = 3, keine 3 = 4, schwarz = 5
    this.players = [];
    this.points = 0;
    this.sonderpunkte = [];
  }
}

function displayPos(num) {
  return wrapIndex(num - me, 4);
}
