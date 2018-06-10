import createDuration from 'date-duration';

export function getOffset (date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'short'
  });

  return formatter.formatToParts(date)
    .find(({type}) => type === 'timeZoneName')
    .value;
}

export function dateParts (date, timeZone) {
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
    case 'month':
      date.setUTCMonth(date.getUTCMonth() + diff);
      break;
    case 'day':
      date.setUTCDate(date.getUTCDate() + diff);
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
  const {year, month, day, ...time} = dateParts(date, timeZone);
console.log(time);
  // const diff = {
  //   hour: oldParts.hour,
  //   minute: oldParts.minute,
  //   second: oldParts.second
  // };

  // date.setUTCHours(date.getUTCHours() - oldParts.hour);
  // date.setUTCMinutes(date.getUTCMinutes() - oldParts.minute);
  // date.setUTCSeconds(date.getUTCSeconds() - oldParts.second);

  // const duration = createDuration({P: {T: {H: diff.hour, M: diff.minute, S: diff.second}}});

  // // TODO:
  // const result = duration.subtractFrom(date);

  // const newParts = dateParts(date, timeZone);

  // compare(diff, {
  //   hour: newParts.hour,
  //   minute: newParts.minute,
  //   second: newParts.second
  // });

  // date = set(
  //   set(
  //     set(date, 'second', -oldParts.second),
  //     'minute',
  //     -oldParts.minute
  //   ),
  //   'hour',
  //   -oldParts.hour
  // );

  // const newParts = dateParts(date, timeZone);

  // console.log(oldParts, newParts);

  return date;
}

export const relativeFormats = new Map([
  ['midnight', midnight],
  ['today', midnight]
]);
