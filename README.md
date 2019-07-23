date-time-zone [![Build status](https://api.travis-ci.org/smhg/date-time-zone.png)](https://travis-ci.org/smhg/date-time-zone)
======

Create and manipulate time zone specific dates as regular Date objects.
(~Abuses~)Uses [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) and [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## Example
```javascript
const { createDate, detectTimeZone } = require('date-time-zone');

if (!detectTimeZone()) {
  console.warn('Time zones not (fully) supported');
}

const timeZone = 'Europe/Berlin';
createDate({ timeZone }); // now

createDate(2019, 0, 1, { timeZone }); // start of 2019 in Berlin

const date = createDate({ timeZone });
date.setHours(0, 0, 0, 0);
console.log(date.toString()); // start of today in Berlin
```

## Usage
When you need to work with a Date instance in another time zone, replace `new Date` with `createDate` and add an options object (`{ timeZone: '...' }`) as the last parameter.

All other usage is the same as regular Date objects, with manipulations (`setDate`, `setHours`, ...) happening in the specified time zone and `toString()` returning the date and time in the specified time zone.
