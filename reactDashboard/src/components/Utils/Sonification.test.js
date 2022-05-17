import { calculateMaxDataValue } from "../Utils/Sonification";

// TODO - all the rest of the speech and audio
// Requires some non-trivial mocking of the web speech and audio APIs in Jest

test("calculateMaxDataValue default result on bad input", () => {
  expect(calculateMaxDataValue()).toBe(100);
  expect(calculateMaxDataValue(null)).toBe(100);
  expect(calculateMaxDataValue([])).toBe(100);
  expect(calculateMaxDataValue([0])).toBe(100);
  expect(calculateMaxDataValue([-2, 0, 0, -1])).toBe(100);
});

test("calculateMaxDataValue", () => {
  // Up to 100, round to nearest 10
  expect(calculateMaxDataValue([0, 0, 1])).toBe(1);
  expect(calculateMaxDataValue([0, 0, 9])).toBe(9);
  expect(calculateMaxDataValue([0, 0, 10])).toBe(10);
  expect(calculateMaxDataValue([0, 0, 11])).toBe(20);
  expect(calculateMaxDataValue([0, 0, 19])).toBe(20);
  expect(calculateMaxDataValue([0, 0, 20])).toBe(20);
  expect(calculateMaxDataValue([0, 0, 39])).toBe(40);
  expect(calculateMaxDataValue([0, 0, 99])).toBe(100);

  // Above 100, round to nearest order unit - 1
  expect(calculateMaxDataValue([0, 0, 100])).toBe(100);
  expect(calculateMaxDataValue([0, 0, 101])).toBe(110);
  expect(calculateMaxDataValue([0, 0, 500])).toBe(500);
  expect(calculateMaxDataValue([0, 0, 501])).toBe(510);

  expect(calculateMaxDataValue([0, 0, 999])).toBe(1000);
  expect(calculateMaxDataValue([0, 0, 1000])).toBe(1000);
  expect(calculateMaxDataValue([0, 0, 1001])).toBe(1100);
  expect(calculateMaxDataValue([0, 0, 6000])).toBe(6000);
  expect(calculateMaxDataValue([0, 0, 8001])).toBe(8100);

  expect(calculateMaxDataValue([0, 0, 10000])).toBe(10000);
  expect(calculateMaxDataValue([0, 0, 10001])).toBe(11000);
  expect(calculateMaxDataValue([0, 0, 20000])).toBe(20000);
  expect(calculateMaxDataValue([0, 0, 33333])).toBe(34000);

  expect(calculateMaxDataValue([0, 0, 100001])).toBe(110000);
});
