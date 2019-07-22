# date-modify
Create and manipulate time zone specific dates as regular Date objects.
(~Abuses~)Uses [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) and [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## Example
```javascript
const timeZone = 'Europe/Berlin';
createDate({ timeZone }); // now

createDate(2019, 0, 1, { timeZone }); // start of 2019 in Berlin

const date = createDate({ timeZone });
date.setHours(0, 0, 0, 0);
console.log(date.toString()); // start of today in Berlin
```

## Usage
Replace `new Date` with `createDate` and add a `{ timeZone: '...' }` object as the last parameter. All other usage is the same as regular Date objects, with manipulations happening in the specified time zone.
