const DATE_PARTS = ['year', 'month', 'day', 'weekday', 'hour', 'minute', 'second', 'millisecond'];

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const formatter = {};

export function getTzTime (date, timeZone) {
  formatter[timeZone] = formatter[timeZone] || new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const parts = new Map(
    formatter[timeZone].formatToParts(date)
      .filter(({ type }) => DATE_PARTS.indexOf(type) >= 0)
      .sort((left, right) => DATE_PARTS.indexOf(left.type) - DATE_PARTS.indexOf(right.type))
      .map(
        ({ type, value }) => [type, parseInt(value, 10)]
      )
  );

  if (parts.size !== 3) {
    throw new Error(`Unable to retrieve full date for timezone '${timeZone}')`);
  }

  return Array.from(parts.values());
}

export function useTimeZone (timeZone, date, method, ...args) {
  let [day, hour, minute] = getTzTime(date, timeZone);

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
  const [newDay, newHour, newMinute] = getTzTime(date, timeZone);
  date.setUTCDate(date.getUTCDate() + (day - newDay));
  date.setUTCHours(date.getUTCHours() + (hour - newHour));
  date.setUTCMinutes(date.getUTCMinutes() + (minute - newMinute));

  return +date;
};
