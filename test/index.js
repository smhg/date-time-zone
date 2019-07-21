import { createDate } from '../src';
import assert from 'assert';

const timeZone = 'Europe/Brussels';

describe('test()', () => {
  it('should create a regular Date', () => {
    const date = createDate();
    const ref = new Date();

    assert.strictEqual(date.toString(), ref.toString());
  });

  it('should', () => {
    // const date = new Date(2019, 9, 30, 10, 20, 30);
    const date = createDate(2019, 9, 30, 10, 20, 30, { timeZone });
    date.setHours(0, 0, 0, 0);
console.log(date);
    const str = date.toLocaleString('en-US', { timeZone });
console.log(str);
    // const tzValues = getTzValues(date, timeZone);

    // assert.strictEqual(tzValues.get('hour'), 0);
    // assert.strictEqual(tzValues.get('minute'), 0);
    // assert.strictEqual(tzValues.get('second'), 0);
    // assert.strictEqual(tzValues.get('millisecond'), 0);
  });

  // it('should', () => {
  //   const date = createDate(timeZone, 2019, 9, 30, 10, 20, 30);
  //   useBrussels(date, 'setUTCHours', 0, 0, 0, 0);
  //   const [, hour, minute] = getTzTime(date, timeZone);

  //   assert.strictEqual(hour, 0);
  //   assert.strictEqual(minute, 0);
  // });

  // it('should', () => {
  //   const now = new Date(2019, 9, 30, 10, 20, 30);
  //   const midnight = new Date(useBrussels(new Date(now), 'setUTCHours', 0, 0, 0, 0));
  //   const startOfMonth = new Date(useBrussels(new Date(midnight), 'setUTCDate', 1));
  //   const [day, hour, minute] = getTzTime(startOfMonth, timeZone);

  //   assert.strictEqual(day, 1);
  //   assert.strictEqual(hour, 0);
  //   assert.strictEqual(minute, 0);
  // });

  // it('should', () => {
  //   const now = new Date(2019, 9, 30, 10, 20, 30);
  //   const noon = new Date(useBrussels(new Date(now), 'setUTCHours', 12, 0));
  //   const startOfYear = new Date(useBrussels(new Date(noon), 'setUTCMonth', 0, 1));
  //   const [day, hour, minute] = getTzTime(startOfYear, timeZone);

  //   assert.strictEqual(day, 1);
  //   assert.strictEqual(hour, 12);
  //   assert.strictEqual(minute, 0);
  // });
});
