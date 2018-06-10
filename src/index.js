import {getOffset, dateParts, relativeFormats} from './util';

let defaultTimeZone = 'UTC';

export function setDefaultTimeZone (timeZone) {
  defaultTimeZone = timeZone;
}

export default function modify (date, action, timeZone = defaultTimeZone) {
  let clone = new Date(+date);

  if (relativeFormats.has(action)) {
    const dateOffset = getOffset(date, timeZone);
    relativeFormats.get(action)(clone, timeZone);
    const cloneOffset = getOffset(clone, timeZone);
    if (dateOffset !== cloneOffset) {
      throw new Error(`Timezone changed during modification (${dateOffset} became ${cloneOffset})`);
    }
  }

  return clone;
}

export function add (date, duration, timeZone = defaultTimeZone) {
  return duration.addTo(date);
}

export function subtract (date, duration, timeZone = defaultTimeZone) {
  return duration.subtractFrom(date);
}

export const sub = subtract;
