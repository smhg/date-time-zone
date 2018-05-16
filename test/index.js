import modify, {add, subtract, setDefaultTimeZone} from '../index';
import createDuration from 'date-duration';
import assert from 'assert';

describe('modify', () => {
  it('should', () => {
    const date = new Date(2018, 4, 14, 20, 52, 16);

    assert.equal(+modify(date, 'midnight'), +(new Date(2018, 4, 14, 0, 0, 0)));
  });
});

describe('add', () => {
  it('should', () => {
    const date = new Date(2018, 4, 14, 20, 52, 16);

    assert.equal(+add(date, createDuration('P1D')), +(new Date(2018, 4, 15, 20, 52, 16)));
  });
});

describe('subtract', () => {
  it('should', () => {
    const date = new Date(2018, 4, 14, 20, 52, 16);

    assert.equal(+subtract(date, createDuration('P1D')), +(new Date(2018, 4, 13, 20, 52, 16)));
  });
});

describe('setDefaultTimeZone', () => {
  it('should use the default format', () => {
    setDefaultTimeZone('Europe/Brussels');
  });
});
