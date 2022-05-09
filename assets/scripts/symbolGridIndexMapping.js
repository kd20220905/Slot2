// from(server)
// 0   1  2  3  4
// 5   6  7  8  9
// 10 11 12 13 14

// to(client)
// 0   3  6  9 12
// 1   4  7 10 13
// 2   5  8 11 14
const mapping = {
  0: 0,
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  5: 1,
  6: 4,
  7: 7,
  8: 10,
  9: 13,
  10: 2,
  11: 5,
  12: 8,
  13: 11,
  14: 14
};

export default mapping;