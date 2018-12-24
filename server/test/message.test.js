const expect = require(`expect`);
const {generateMessage, generateLocationMessage} = require(`../utils/message`);

describe(`generateMessage`, () => {
  it(`should generate message`, function () {
    const from = `Jane`;
    const text = `Hello`;

    const message = generateMessage(from, text);

    expect(typeof(message.createdAt)).toBe(`number`);
    expect(message).toMatchObject({
      from,
      text
    });
  });

  it(`should generate correct location object`, function () {
    const from = `Alex`;
    const lat = 34;
    const lon = 51.456;

    const message = generateLocationMessage(from, lat, lon);
    const url = `https://www.google.com/maps?q=${lat},${lon}`

    expect(typeof(message.createdAt)).toBe(`number`);

    expect(message).toMatchObject({
      from,
      url
    });
  });
});
