const DATE_PARTS = ['year', 'month', 'day', 'weekday', 'hour', 'minute', 'second', 'millisecond'];

const formatter = {};

export function getTzValues (date, timeZone) {
  formatter[timeZone] = formatter[timeZone] || new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

  const parts = new Map(
    formatter[timeZone].formatToParts(date)
      .filter(({ type }) => DATE_PARTS.indexOf(type) >= 0)
      .sort((left, right) => DATE_PARTS.indexOf(left.type) - DATE_PARTS.indexOf(right.type))
      .map(
        ({ type, value }) => [type, parseInt(value, 10)]
      )
  );

  parts.set('millisecond', date.getMilliseconds());

  if (parts.size !== 7) {
    throw new Error(`Unable to retrieve full date for timezone '${timeZone}')`);
  }

  return parts;
}

export function useTimeZone (timeZone, date, method, ...args) {
  let [day, hour, minute] = getTzValues(date, timeZone);

  switch (method) {
    case 'setUTCFullYear':
      day = args.length > 2 ? args[2] : day;
      break;
    case 'setUTCMonth':
      day = args.length > 1 ? args[1] : day;
      break;
    case 'setUTCDate':
      day = args[0];
      break;
    case 'setUTCHours':
      hour = args[0];
      minute = args.length > 1 ? args[1] : minute;
      break;
    case 'setUTCMinutes':
      minute = args[0];
      break;
  }

  // regular method gets us within 1 day (before/after)
  date[method](...args);

  // fixup day, hour, minute (if necessary)
  const [newDay, newHour, newMinute] = getTzValues(date, timeZone);
  date.setUTCDate(date.getUTCDate() + (day - newDay));
  date.setUTCHours(date.getUTCHours() + (hour - newHour));
  date.setUTCMinutes(date.getUTCMinutes() + (minute - newMinute));

  return +date;
};

const WRAP_SETTERS = ['setDate', 'setFullYear', 'setHours', 'setMinutes', 'setMonth'];

export function createDate (...args) {
  let timeZone;

  if (typeof args[args.length - 1] === 'object') {
    timeZone = args.splice(-1, 1)[0].timeZone;
  }

  return new Proxy(new Date(...args), {
    get: function (date, prop, rec) {
      console.log(date, prop, typeof date[prop]);
      if (typeof date[prop] === 'function') {
        if (!timeZone || !WRAP_SETTERS.includes(prop)) {
          console.log('crit', date, prop);
          return date[prop].bind(date);
        }

        return new Proxy(date[prop], {
          apply: function (fn, proxy, args) {



            // HIER IS date al Invalid Date! (vlak voor setHours)



            return fn.bind(date)(args);
          }
        });
      }

      return Reflect.get(...arguments);
    }
  });
}
