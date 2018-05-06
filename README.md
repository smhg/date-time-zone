# date-modify

```javascript
modify(date, 'midnight') // strtotime
modify(date, createDuration('P1D')) // date-duration

// aliases
add(date, 1, 'year') // modify(date, '+1 year')
subtract(date, 1, 'year') // modify(date, '-1 year')
sub(date, 1, 'year') // modify(date, '-1 year')
```

# date-format

```javascript
format(date, 'c') // 2004-02-12T15:19:21+00:00
```
