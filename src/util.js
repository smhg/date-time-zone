export function getOffset (date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'short'
  });

  return formatter.formatToParts(date)
    .find(({type, value}) => type === 'timeZoneName')
    .value;
}

function dateParts (date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en', {
    hour12: false,
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

  return formatter.formatToParts(date)
    .filter(({type}) => type !== 'literal')
    .reduce((parts, {type, value}) => {
      parts[type] = parseInt(value, 10);

      return parts;
    }, {});
}

function set (date, part, diff) {
  switch (part) {
    case 'year':
      date.setUTCFullYear(date.getUTCFullYear() + diff);
      break;
    case 'hour':
      date.setUTCHours(date.getUTCHours() + diff);
      break;
    case 'minute':
      date.setUTCMinutes(date.getUTCMinutes() + diff);
      break;
    case 'second':
      date.setUTCSeconds(date.getUTCSeconds() + diff);
      break;
  }

  return date;
}

function midnight (date, timeZone) {
  const parts = dateParts(date, timeZone);

  return set(
    set(
      set(date, 'second', 0 - parts.second),
      'minute',
      0 - parts.minute
    ),
    'hour',
    0 - parts.hour
  );
}

export const relativeFormats = new Map([
  ['midnight', midnight],
  ['today', midnight]
]);
