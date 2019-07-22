const { createDate, detectTimeZone } = require('../src');
const assert = require('assert');

const timeZone = 'Europe/Brussels';

describe('detectTimeZone()', () => {
  it('should detect system time zone', () => {
    const tz = detectTimeZone();

    assert.strictEqual(tz, process.env.TZ);
  });
});

describe('test()', () => {
  it('should create a regular Date', () => {
    const ref = new Date();
    const date = createDate(ref);

    assert.strictEqual(date.toString(), ref.toString());
  });

  it('should start with now', () => {
    const date = createDate({ timeZone });
    date.setHours(0, 0, 0, 0);

    const str = date.toLocaleString('nl-BE', { timeZone, hour12: false });
    assert.strictEqual(str.substr(-8), '00:00:00');
  });

  it('should set local date', () => {
    const date = createDate(2019, 9, 30, 10, 20, 30, { timeZone });

    const str = date.toLocaleString('nl-BE', { timeZone, hour12: false });
    assert.strictEqual(str, '30/10/2019 10:20:30');
  });

  it('should set relative local date', () => {
    const date = createDate(2019, 9, -1, 10, 20, 30, { timeZone });

    const str = date.toLocaleString('nl-BE', { timeZone, hour12: false });
    assert.strictEqual(str, '29/9/2019 10:20:30');
  });

  it('should modify local date', () => {
    const date = createDate(2019, 9, 27, 10, 20, 30, { timeZone });
    date.setHours(0, 0, 0, 0); // jumps across DST

    const str = date.toLocaleString('nl-BE', { timeZone, hour12: false });
    assert.strictEqual(str, '27/10/2019 00:00:00');
  });

  it('should relative modify local date', () => {
    const date = createDate(2019, 9, 30, 10, 20, 30, { timeZone });
    date.setDate(-1);

    const str = date.toLocaleString('nl-BE', { timeZone, hour12: false });
    assert.strictEqual(str, '29/9/2019 10:20:30');
  });
});
