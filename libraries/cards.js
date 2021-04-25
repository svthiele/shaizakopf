const cardVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "B", "D", "K", "A"];
// const cardSuits = ["Karo", "Herz", "Pik", "Kreuz"];
const cardSymbols = ["♢", "♡", "♠", "♣"];

class PlayingCard {
  constructor(suit, value) {
    this.suit = suit; // 0 -3 = Karo, Herz, Pick, Kreuz
    this.value = value; // 0 - 12 = 2 - Ass
    this.flipped = false;
    this.xPos = 0;
    this.yPos = 0;
    this.player = 4; // 4 = no player
    this.div;

  }

  get cardName() {
    let suitSym = this.cardSuit;
    let valName = this.cardValue;

    return suitSym + valName;
  }

  get cardSuit() {
    return cardSymbols[this.suit];
  }

  get cardValue() {
    return cardVals[this.value];
  }

  get points() {
    var points = 0;
    switch (this.value) {
      case 8: //10
        points = 10;
        break;
      case 9: //Bube
        points = 2;
        break;
      case 10: // Dame
        points = 3;
        break;
      case 11: // König
        points = 4;
        break;
      case 12: // Ass
        points = 11;
        break;
    }
    return points;
  }

  get inHand() {
    var inHand = false;
    for (var i = 0; i < players[this.player].hand.cards.length; i++) {
      if (players[this.player].hand.cards[i] === this) {
        inHand = true;
      }
    }
    return inHand;
  }

  display() {
    if (this.flipped) {
      this.div.html(cardImgs[this.suit][this.value - 7][1])
    } else {
      this.div.html(cardBackImg[1])
    }

    this.div.size(cardW, cardH);
    this.div.position(this.xPos - cardW / 2, this.yPos - cardH / 2);
  }

  remove() {
    this.div.remove();
  }

  get mouseOver() {
    var left = this.xPos - (cardW / 2);
    var right = this.xPos + (cardW / 2);
    var top = this.yPos - (cardH / 2);
    var bottom = this.yPos + (cardH / 2);
    return (mouseX > left && mouseX < right && mouseY < bottom && mouseY > top)
  }

  isTrump() {
    return (this.sortPos() > 10); //nur im Standard Spiel
  }

  sortPos() {
    for (let i = 0; i < sort.length; i++) {
      if ((this.suit == sort[i].suit) && (this.value == sort[i].value)) {
        return i;
      }
    }
  }

  trumpFehl() {
    if (this.isTrump()) {
      return 0;
    } else {
      return this.suit;
    }
  }

  get dulle() {
    return (this.value == 8 && this.suit == 1);
  }

  get fuchs() {
    return (this.value == 12 && this.suit == 0);
  }

  get krDame() {
    return (this.value == 10 && this.suit == 3);
  }

  get karlchen() {
    return (this.value == 9 && this.suit == 3);
  }
}

class Deck {
  constructor() {
    let startCard;

    this.cards = [];

    if (mitNeunen) {
      startCard = 7;
    } else {
      startCard = 8;
    }

    for (let i = 0; i < 2; i++) { // 2 Decks
      for (let suit = 0; suit < 4; suit++) { // 4 Farben
        for (let val = startCard; val < 13; val++) { // je nachdem ab 9 oder 10 bis Ass = 7/8-13
          this.cards.push(new PlayingCard(suit, val));
        }
      }
    }

    deckInitCount = this.cards.length;
  }

  shuffle() {
    var currentIndex = this.cards.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  deal() {
    let numCards = deck.cards.length;
    let currHand = (dealer + 1) % playerCount; //dealer + 1;

    for (let i = numCards - 1; i >= 0; i--) {
      deck.cards[i].player = currHand;
      players[currHand].hand.add(deck.cards[i]); // add the top cards to the current hand
      //if (currHand == me) {
      deck.cards[i].flipped = true;
      //}
      deck.cards.splice(i, 1); // and remove it from the pile

      currHand = (currHand + 1) % playerCount;
    }
  }
}

class Hand {
  constructor() {
    this.cards = [];
  }

  add(newCard) {
    this.cards.push(newCard);
  }

  sort() {
    var tmpHand = [];
    for (let c = 0; c < sort.length; c++) {
      for (var i = 0; i < this.cards.length; i++) {
        if ((this.cards[i].suit == sort[c].suit) && (this.cards[i].value == sort[c].value)) {
          tmpHand.push(this.cards[i]);
        }
      }
    }
    this.cards = tmpHand;
  }

  display(pos) { // position unten = 0, links = 1, oben = 2, rechts = 3
    const marginX = (width - (cardW + ((this.cards.length - 1) * cardW * 0.6))) / 2;
    const marginY = (height - (cardH + ((this.cards.length - 1) * cardH * 0.4))) / 2;
    //const cardW = (width - (marginX * 2)) / this.cards.length;
    //const cardH = (height - (marginY * 2)) / this.cards.length;
    for (let i = 0; i < this.cards.length; i++) {

      if (pos == 0) { //bottom
        var y = height - (cardH * 0.6);
        var x = (i * cardW * 0.6) + marginX + (cardW / 2);
      }

      if (pos == 1) { //left
        var x = (cardW * 0.75);
        var y = (i * cardH * 0.4) + marginY + (cardH / 2);
      }

      if (pos == 2) { //top
        var y = (cardH * 0.6);
        var x = (i * cardW * 0.6) + marginX + (cardW / 2);
      }

      if (pos == 3) { //right
        var x = width - (cardW * 0.75);
        var y = (i * cardH * 0.4) + marginY + (cardH / 2);

      }

      this.cards[i].xPos = x;
      this.cards[i].yPos = y;
      this.cards[i].display()
    }
  }

  remove(card) {
    for (var i = 0; i < this.cards.length; i++) {
      if (this.cards[i] === card) {
        this.cards.splice(i, 1);
      }
    }
  }

  hasSuit(suit) {
    let result = false;
    if (suit == 0) { //kann Trumpf bedienen?
      for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].isTrump()) {
          result = true;
        }
      }
    } else {
      for (var i = 0; i < this.cards.length; i++) {
        if (!(this.cards[i].isTrump()) && this.cards[i].suit == suit) {
          result = true;
        }
      }
    }
    return result;
  }

  get count() {
    return this.cards.length;
  }
}

class Stich {
  constructor(suit, first) {
    this.cards = [];
    this.suit = suit;
    this.first = first;
    this.winner = -1;
  }

  display() {
    for (let i = 0; i < this.cards.length; i++) {

      if (this.cards[i] instanceof PlayingCard) {
        var x;
        var y;
        switch (displayPos((i + this.first) % 4)) {
          case 0:
            x = width / 2;
            y = height / 2 + (cardH * 0.75);
            break;
          case 1:
            x = width / 2 - (cardW * 0.75);
            y = height / 2;
            break;
          case 2:
            x = width / 2;
            y = height / 2 - (cardH * 0.75);
            break;
          case 3:
            x = width / 2 + (cardW * 0.75);
            y = height / 2;
            break;
        }

        this.cards[i].xPos = x;
        this.cards[i].yPos = y;
        this.cards[i].display();
      }
    }
  }

  add(newCard) {
    newCard.flipped = true;
    this.cards.push(newCard);
  }

  take() {
    var x;
    var y;
    switch (displayPos(this.winner)) {
      case 0:
        x = width * 0.75;
        y = height - cardH * 2;
        break;
      case 1:
        x = cardW * 2;
        y = height * 0.75;
        break;
      case 2:
        x = width * 0.25;
        y = cardH * 2;
        break;
      case 3:
        x = width - (cardW * 2);
        y = height * 0.25;
        break;
    }

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].xPos = x;
      this.cards[i].yPos = y;
      this.cards[i].flipped = false;
      this.cards[i].display();
    }
  }

  get count() {
    var count = 0;
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] instanceof PlayingCard) {
        count += 1
      }
    }

    return count;
  }

  get points() {
    var points = 0;

    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] instanceof PlayingCard) {
        points += this.cards[i].points;
      }
    }
    return points
  }
}


class Player {
  constructor(name) {
    //this.num = num;
    this.hand = new Hand;
    this.team = -1; // 0 = re 1 = kontra
    this.pos = 0;
    this.name = name;
    this.stats;
    this.points = 0;
    this.gamePoints = 0;
    this.ansagen = 0;
  }

  display() {
    this.hand.display(this.pos);
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
