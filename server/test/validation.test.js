const expect = require(`expect`);

const {isRealString} = require(`../utils/validation`);

describe(`isRealString`, () => {
  it(`should reject non-string values`, function () {
    const string = 5;
    expect(isRealString(string)).toBe(false);
  });

  it(`should reject string with only spaces`, function () {
  const string = `    `;

  expect(isRealString(string)).toBe(false);
  });

  it(`should allow string with non-spaces characters`, function () {
  const string = ` test  `;

  expect(isRealString(string)).toBe(true);
  });
});
