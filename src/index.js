import { getOffset, relativeFormats } from './util';

let defaultTimeZone = 'UTC';

export function setDefaultTimeZone (timeZone) {
  defaultTimeZone = timeZone;
}

export default function modify (date, action, timeZone = defaultTimeZone) {
  const clone = new Date(+date);

  if (relativeFormats.has(action)) {
    relativeFormats.get(action)(clone, timeZone);

    if (getOffset(date, timeZone) !== getOffset(clone, timeZone)) {
      throw new Error('Timezone changed during modification');
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
