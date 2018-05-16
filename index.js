let defaultTimeZone = 'UTC';

export function setDefaultTimeZone (timeZone) {
  defaultTimeZone = timeZone;
}

export default function modify (date, action, timeZone = defaultTimeZone) {
  return date;
}

export function add (date, duration, timeZone = defaultTimeZone) {
  return duration.addTo(date);
}

export function subtract (date, duration, timeZone = defaultTimeZone) {
  return duration.subtractFrom(date);
}

export const sub = subtract;
