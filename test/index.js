import modify, {add, subtract, setDefaultTimeZone} from '../src';
import createDuration from 'date-duration';
import assert from 'assert';

describe('modify()', () => {
  it('should', () => {
    let date = new Date(Date.UTC(2018, 4, 15, 20, 52, 16));

    assert.equal(+modify(date, 'midnight'), Date.UTC(2018, 4, 15, 0, 0, 0));
    assert.equal(+modify(date, 'midnight', 'Europe/Brussels'), Date.parse('2018-05-15 00:00:00+02:00'));

    // accross DST
    date = new Date(Date.UTC(2018, 2, 25, 20, 52, 16));

    assert.equal(+modify(date, 'midnight'), Date.UTC(2018, 2, 25, 0, 0, 0));
    assert.equal(+modify(date, 'midnight', 'Europe/Brussels'), Date.parse('2018-03-25 00:00:00+01:00'));
  });
});

describe('add()', () => {
  it('should', () => {
    const date = new Date(Date.UTC(2018, 4, 14, 20, 52, 16));

    assert.equal(+add(date, createDuration('P1D')), Date.UTC(2018, 4, 15, 20, 52, 16));
  });
});

describe('subtract()', () => {
  it('should', () => {
    const date = new Date(Date.UTC(2018, 4, 14, 20, 52, 16));

    assert.equal(+subtract(date, createDuration('P1D')), Date.UTC(2018, 4, 13, 20, 52, 16));
  });
});

describe('setDefaultTimeZone()', () => {
  it('should use the default format', () => {
    setDefaultTimeZone('Europe/Brussels');
  });
});
