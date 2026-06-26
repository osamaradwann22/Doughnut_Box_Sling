export const GameConfig = {
  doughnutsPerPlayer: 5,
  doughnutRadius: 22,
  wallThickness: 28,
  dividerThickness: 22,
  goalWidth: 118,
  restitution: 0.88,
  frictionAir: 0.018,
  maxPullDistance: 92,
  launchPower: 0.18,
  winCheckDelay: 320,
  aiDifficulties: {
    easy: {
      shotDelay: 2300,
      aimNoise: 70,
      speedMin: 8.2,
      speedMax: 11.2
    },
    medium: {
      shotDelay: 1550,
      aimNoise: 38,
      speedMin: 10.2,
      speedMax: 13.2
    },
    hard: {
      shotDelay: 950,
      aimNoise: 16,
      speedMin: 12.4,
      speedMax: 15.6
    }
  },
  palette: {
    cardboard: 0xffc977,
    cardboardDark: 0xd9863d,
    cardboardLight: 0xffdfa3,
    linerTop: 0xffcad9,
    linerBottom: 0xcdf1ff,
    ink: 0x4d2f24,
    cream: 0xfff0cb,
    shadow: 0x8f4e37,
    divider: 0xf49b68,
    goalTrim: 0xfff3b0,
    ui: 0xffffff
  },
  teamStyles: {
    glazed: {
      name: "Glazed",
      pastry: 0xd88b48,
      icing: 0xfff4dd,
      sprinkles: [0xff6f9f, 0x76c9ff, 0xffdd5e, 0xffffff]
    },
    chocolate: {
      name: "Chocolate",
      pastry: 0xc4773f,
      icing: 0x5c2f20,
      sprinkles: [0xfff0cb, 0xff9bba, 0xb6f06f, 0xffffff]
    }
  }
};
