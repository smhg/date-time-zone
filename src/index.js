const detectTimeZone = require('./detect');

const DATE_PARTS = ['year', 'month', 'day', 'weekday', 'hour', 'minute', 'second', 'millisecond'];
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const WRAP_SETTERS = ['setFullYear', 'setMonth', 'setDate', 'setDay', 'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds'];
const WRAP_GETTERS = ['getFullYear', 'getMonth', 'getDate', 'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds'];

const formatterCache = new Map();

function getFormatter (timeZone) {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(timeZone, new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }));
  }

  return formatterCache.get(timeZone);
}

function getTzValues (date, timeZone) {
  const valueFormatter = getFormatter(timeZone);

  const parts = new Map(
    valueFormatter.formatToParts(date)
      .filter(({ type }) => DATE_PARTS.indexOf(type) >= 0)
      .sort(
        (left, right) =>
          DATE_PARTS.indexOf(left.type) - DATE_PARTS.indexOf(right.type)
      )
      .map(
        ({ type, value }) => [
          type,
          type === 'weekday'
            ? WEEKDAYS.indexOf(value.toLowerCase())
            : parseInt(value, 10)
        ]
      )
  );

  if (parts.size !== 7) {
    throw new Error(`Unable to retrieve full date for time zone '${timeZone}')`);
  }

  parts.set('month', parts.get('month') - 1);
  parts.set('millisecond', date.getMilliseconds());

  return Array.from(parts.values());
}

function setValues (date, values) {
  date.setUTCFullYear(...values.slice(0, 3));
  date.setUTCHours(...values.slice(4));

  return date;
}

function utcToLocal (date, timeZone) {
  const tzValues = getTzValues(date, 'UTC');
  const currentValues = getTzValues(date, timeZone);
  const utcValues = tzValues.map(
    (value, idx) => value + (value - currentValues[idx])
  );

  setValues(date, utcValues);
}

function createDate (...args) {
  if (args.length === 0) {
    return new Date();
  }

  const options = { locale: 'en-US' };

  if (typeof args[args.length - 1] === 'object') {
    Object.assign(options, args.pop());
  }

  if (!options.timeZone) {
    return new Date(...args);
  }

  let date;

  if (args.length <= 1) {
    // format: new Date()
    // format: new Date(value)
    // format: new Date(dateString)
    date = new Date(...args);
  } else {
    // format: new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
    date = new Date(Date.UTC(...args));
    utcToLocal(date, options.timeZone);
  }

  return new Proxy(date, {
    get: function (target, prop) {
      if (prop === Symbol.toStringTag) {
        return 'Date';
      }

      if (typeof target[prop] === 'function') {
        if (WRAP_GETTERS.includes(prop)) {
          return new Proxy(target[prop], {
            apply: function (fn, proxy, args) {
              const idx = WRAP_GETTERS.indexOf(prop);
              const tzValues = getTzValues(target, options.timeZone);

              return tzValues[idx];
            }
          });
        }

        if (WRAP_SETTERS.includes(prop)) {
          return new Proxy(target[prop], {
            apply: function (fn, proxy, args) {
              const idx = WRAP_SETTERS.indexOf(prop);
              const utcValues = getTzValues(target, options.timeZone);

              utcValues.splice(idx, args.length, ...args);
              setValues(target, utcValues);

              utcToLocal(target, options.timeZone);

              return +target;
            }
          });
        }

        return target[prop].bind(target);
      }

      return Reflect.get(...arguments);
    }
  });
}

module.exports = { createDate, detectTimeZone };
