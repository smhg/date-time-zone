import { useTimeZone, getTzTime } from '../src';
import assert from 'assert';

const timeZone = 'Europe/Brussels';
const useBrussels = (...args) => useTimeZone(timeZone, ...args);

describe('test()', () => {
  it('should', () => {
    const date = new Date(2019, 9, 30, 10, 20, 30);
    useBrussels(date, 'setUTCHours', 0, 0, 0, 0);
    const [, hour, minute] = getTzTime(date, timeZone);

    assert.strictEqual(hour, 0);
    assert.strictEqual(minute, 0);
  });

  it('should', () => {
    const now = new Date(2019, 9, 30, 10, 20, 30);
    const midnight = new Date(useBrussels(new Date(now), 'setUTCHours', 0, 0, 0, 0));
    const startOfMonth = new Date(useBrussels(new Date(midnight), 'setUTCDate', 1));
    const [day, hour, minute] = getTzTime(startOfMonth, timeZone);

    assert.strictEqual(day, 1);
    assert.strictEqual(hour, 0);
    assert.strictEqual(minute, 0);
  });

  it('should', () => {
    const now = new Date(2019, 9, 30, 10, 20, 30);
    const noon = new Date(useBrussels(new Date(now), 'setUTCHours', 12, 0));
    const startOfYear = new Date(useBrussels(new Date(noon), 'setUTCMonth', 0, 1));
    const [day, hour, minute] = getTzTime(startOfYear, timeZone);

    assert.strictEqual(day, 1);
    assert.strictEqual(hour, 12);
    assert.strictEqual(minute, 0);
  });
});
