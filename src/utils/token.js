export function isExpired(expires) {
  return !expires || parseFloat(expires) < Date.now();
}
