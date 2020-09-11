import { calculateMaxDataValue } from "../Utils/Sonification";

// TODO - all the rest of the speech and audio
// Requires some non-trivial mocking of the web speech and audio APIs in Jest

test("calculateMaxDataValue default result on bad input", () => {
  expect(calculateMaxDataValue()).toStrictEqual(100);
  expect(calculateMaxDataValue(null)).toStrictEqual(100);
  expect(calculateMaxDataValue([])).toStrictEqual(100);
  expect(calculateMaxDataValue([0])).toStrictEqual(100);
  expect(calculateMaxDataValue([-2, 0, 0, -1])).toStrictEqual(100);
});

test("calculateMaxDataValue", () => {
  // Up to 100, round to nearest 10
  expect(calculateMaxDataValue([0, 0, 1])).toStrictEqual(1);
  expect(calculateMaxDataValue([0, 0, 9])).toStrictEqual(9);
  expect(calculateMaxDataValue([0, 0, 10])).toStrictEqual(10);
  expect(calculateMaxDataValue([0, 0, 11])).toStrictEqual(20);
  expect(calculateMaxDataValue([0, 0, 19])).toStrictEqual(20);
  expect(calculateMaxDataValue([0, 0, 20])).toStrictEqual(20);
  expect(calculateMaxDataValue([0, 0, 39])).toStrictEqual(40);
  expect(calculateMaxDataValue([0, 0, 99])).toStrictEqual(100);

  // Above 100, round to nearest order unit - 1
  expect(calculateMaxDataValue([0, 0, 100])).toStrictEqual(100);
  expect(calculateMaxDataValue([0, 0, 101])).toStrictEqual(110);
  expect(calculateMaxDataValue([0, 0, 500])).toStrictEqual(500);
  expect(calculateMaxDataValue([0, 0, 501])).toStrictEqual(510);

  expect(calculateMaxDataValue([0, 0, 999])).toStrictEqual(1000);
  expect(calculateMaxDataValue([0, 0, 1000])).toStrictEqual(1000);
  expect(calculateMaxDataValue([0, 0, 1001])).toStrictEqual(1100);
  expect(calculateMaxDataValue([0, 0, 6000])).toStrictEqual(6000);
  expect(calculateMaxDataValue([0, 0, 8001])).toStrictEqual(8100);

  expect(calculateMaxDataValue([0, 0, 10000])).toStrictEqual(10000);
  expect(calculateMaxDataValue([0, 0, 10001])).toStrictEqual(11000);
  expect(calculateMaxDataValue([0, 0, 20000])).toStrictEqual(20000);
  expect(calculateMaxDataValue([0, 0, 33333])).toStrictEqual(34000);

  expect(calculateMaxDataValue([0, 0, 100001])).toStrictEqual(110000);
});
