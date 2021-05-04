const cardVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "B", "D", "K", "A"];
const cardSymbols = ["♢", "♡", "♠", "♣"];

const cardImgValue = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardImgSuits = ['D', 'H', 'S', 'C'];


class CardRank {
  constructor(suit, value) {
    this.suit = suit; // 0 -3 = Karo, Herz, Pick, Kreuz
    this.value = value; // 0 - 12 = 2 - Ass
  }

  get cardIMG() {
    return 'data/cards/' + cardImgValue[this.value] + cardImgSuits[this.suit] + '.svg'
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

  isTrump() {
    return (this.sortPos() > trumpIndex); //nur im Standard Spiel
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

class PlayingCard extends CardRank {
  constructor(suit, value) {
    super(suit, value);
    this.flipped = false;
    this.xPos = 0;
    this.yPos = 0;
    this.player = 4; // 4 = no player
    //this.initDiv();
  }

  initDiv() {
    let card = this;
    this.div = document.createElement('img');
    if (this.player == me) {
      this.div.className = 'mycard';
    } else {
      this.div.className = 'card';
    }
    this.div.src = this.cardIMG;
    this.div.style.position = 'absolute';
    this.div.style.width = Math.floor(cardW) + '.px';
    this.div.style.height = Math.floor(cardH) + '.px';
    this.div.addEventListener('click', function() {
      legalMove(card);
    });

    document.body.appendChild(this.div);
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
      this.div.src = this.cardIMG;
      //this.div.innerHTML = cardImgs[this.suit][this.value - 7][1];
    } else {
      this.div.src = 'data/cards/1B.svg';

      //this.div.innerHTML = cardBackImg[1];
    }
    this.div.style.left = Math.round(this.xPos - cardW / 2) + '.px';
    this.div.style.top = Math.round(this.yPos - cardH / 2) + '.px';
  }

  remove() {
    this.div.remove();
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
      deck.cards[i].initDiv();
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

  sort(order) {
    var tmpHand = [];
    let counter = 0;
    for (let c = 0; c < order.length; c++) {
      for (var i = 0; i < this.cards.length; i++) {
        if ((this.cards[i].suit == order[c].suit) && (this.cards[i].value == order[c].value)) {
          this.cards[i].div.style.zIndex = counter;
          tmpHand.push(this.cards[i]);
          counter++;
        }
      }
    }
    this.cards = tmpHand;
  }

  display(pos) { // position unten = 0, links = 1, oben = 2, rechts = 3
    const marginX = (innerWidth - (cardW + ((this.cards.length - 1) * cardW * 0.6))) / 2;
    const marginY = (innerHeight - (cardH + ((this.cards.length - 1) * cardH * 0.4))) / 2;
    for (let i = 0; i < this.cards.length; i++) {

      if (pos == 0) { //bottom
        var y = innerHeight - (cardH * 0.6);
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
        var x = innerWidth - (cardW * 0.75);
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

  get trumpCount() {
    var trumps = 0;
    for (let card of this.cards) {
      if (card.isTrump()) {
        trumps += 1;
      }
    }
    return trumps;
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
            x = innerWidth / 2;
            y = innerHeight / 2 + (cardH * 0.75);
            break;
          case 1:
            x = innerWidth / 2 - (cardW * 0.75);
            y = innerHeight / 2;
            break;
          case 2:
            x = innerWidth / 2;
            y = innerHeight / 2 - (cardH * 0.75);
            break;
          case 3:
            x = innerWidth / 2 + (cardW * 0.75);
            y = innerHeight / 2;
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
        x = innerWidth * 0.75;
        y = innerHeight - cardH * 2;
        break;
      case 1:
        x = cardW * 2;
        y = innerHeight * 0.75;
        break;
      case 2:
        x = innerWidth * 0.25;
        y = cardH * 2;
        break;
      case 3:
        x = innerWidth - (cardW * 2);
        y = innerHeight * 0.25;
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
