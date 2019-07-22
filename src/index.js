const DATE_PARTS = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
const WRAP_SETTERS = ['setFullYear', 'setMonth', 'setDate', 'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds'];

const formatter = {};

function getFormatter (timeZone) {
  return formatter[timeZone] || new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
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
        ({ type, value }) => [type, parseInt(value, 10)]
      )
  );

  if (parts.size !== 6) {
    throw new Error(`Unable to retrieve full date for time zone '${timeZone}')`);
  }

  parts.set('month', parts.get('month') - 1);
  parts.set('millisecond', date.getMilliseconds());

  return Array.from(parts.values());
}

function utcToLocal (date, timeZone) {
  const tzValues = getTzValues(date, 'UTC');
  const currentValues = getTzValues(date, timeZone);
  const utcValues = tzValues.map((value, idx) => value + (value - currentValues[idx]));

  date.setUTCFullYear(...utcValues.slice(0, 3));
  date.setUTCHours(...utcValues.slice(3));
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
    get: function (date, prop) {
      if (typeof date[prop] === 'function') {
        if (!options.timeZone || (prop !== 'toString' && !WRAP_SETTERS.includes(prop))) {
          return date[prop].bind(date);
        }

        if (prop === 'toString') {
          return (options) => {
            return date.toLocaleString(options.locale, {
              timeZone: options.timeZone,
              hour12: false,
              ...options
            });
          };
        }

        return new Proxy(date[prop], {
          apply: function (fn, proxy, args) {
            const idx = WRAP_SETTERS.indexOf(prop);
            const utcValues = getTzValues(date, options.timeZone);

            utcValues.splice(idx, args.length, ...args);
            date.setUTCFullYear(...utcValues.slice(0, 3));
            date.setUTCHours(...utcValues.slice(3));

            utcToLocal(date, options.timeZone);

            return +date;
          }
        });
      }

      return Reflect.get(...arguments);
    }
  });
}

function detectTimeZone () {
  if (typeof Intl !== 'object') {
    return false;
  }

  if (typeof Intl.DateTimeFormat !== 'function') {
    return false;
  }

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  if (timeZone === undefined || timeZone.length === 0) {
    return false;
  }

  try {
    // Intl.DateTimeFormat needs to support IANA time zone names
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Australia/Sydney',
      timeZoneName: 'long'
    }).format();
  } catch (e) {
    return false;
  }

  return timeZone;
}

module.exports = { createDate, detectTimeZone };
