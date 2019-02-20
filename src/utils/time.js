export function formatDuration(durationInMilliseconds, timeFormat = true) {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);

  return `${minutes}${timeFormat ? ':' : 'm '}${remainder < 10 ? '0' : '' }${remainder}${timeFormat ? '' : 's'}`;
}
