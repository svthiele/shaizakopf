var trumpIndex = 10;

const trumpIndexList = {
  SKa: 10,
  SHe: 11,
  SPi: 10,
  SKr: 10,
  SD: 19,
  SB: 19,
  SAs: 24
};

const sortStd = [
  new CardRank(1, 7),
  new CardRank(1, 11),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  /////

  new CardRank(0, 7),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9),

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),

  new CardRank(1, 8),
];

const sortSHe = [
  new CardRank(0, 7),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(2, 7),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  /////

  new CardRank(1, 7),
  new CardRank(1, 11),
  new CardRank(1, 12),

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9),

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),

  new CardRank(1, 8)
];

const sortSPi = [
  new CardRank(0, 7),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(1, 7),
  new CardRank(1, 11),
  new CardRank(1, 12),

  new CardRank(3, 7),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  /////

  new CardRank(2, 7),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9),

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),

  new CardRank(1, 8)
];

const sortSKr = [
  new CardRank(0, 7),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(1, 7),
  new CardRank(1, 11),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  /////

  new CardRank(3, 7),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9),

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),

  new CardRank(1, 8),
];

const sortSD = [
  new CardRank(0, 7),
  new CardRank(0, 9),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(1, 7),
  new CardRank(1, 9),
  new CardRank(1, 11),
  new CardRank(1, 8),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 9),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 9),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  /////

  new CardRank(0, 10),
  new CardRank(1, 10),
  new CardRank(2, 10),
  new CardRank(3, 10),
];

const sortSB = [
  new CardRank(0, 7),
  new CardRank(0, 10),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(1, 7),
  new CardRank(1, 10),
  new CardRank(1, 11),
  new CardRank(1, 8),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 10),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 10),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12),

  /////

  new CardRank(0, 9),
  new CardRank(1, 9),
  new CardRank(2, 9),
  new CardRank(3, 9)
];

const sortSAs = [
  new CardRank(0, 7),
  new CardRank(0, 9),
  new CardRank(0, 10),
  new CardRank(0, 11),
  new CardRank(0, 8),
  new CardRank(0, 12),

  new CardRank(1, 7),
  new CardRank(1, 9),
  new CardRank(1, 10),
  new CardRank(1, 11),
  new CardRank(1, 8),
  new CardRank(1, 12),

  new CardRank(2, 7),
  new CardRank(2, 9),
  new CardRank(2, 10),
  new CardRank(2, 11),
  new CardRank(2, 8),
  new CardRank(2, 12),

  new CardRank(3, 7),
  new CardRank(3, 9),
  new CardRank(3, 10),
  new CardRank(3, 11),
  new CardRank(3, 8),
  new CardRank(3, 12)
];

const sortSKa = sortStd;
