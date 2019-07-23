function detectTimeZone () {
  if (typeof Intl !== 'object') {
    return false;
  }

  if (typeof Intl.DateTimeFormat !== 'function') {
    return false;
  }

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  if (timeZone === undefined || timeZone.length === 0) {
    return false;
  }

  try {
    // Intl.DateTimeFormat needs to support IANA time zone names
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Australia/Sydney',
      timeZoneName: 'long'
    }).format();
  } catch (e) {
    return false;
  }

  return timeZone;
}

module.exports = detectTimeZone;
