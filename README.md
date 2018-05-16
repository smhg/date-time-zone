# date-modify
Modify date and time

```javascript
modify(date, 'midnight') // strtotime
modify(date, createDuration('P1D')) // date-duration

// aliases
add(date, 1, 'year') // modify(date, '+1 year')
subtract(date, 1, 'year') // modify(date, '-1 year')
```
