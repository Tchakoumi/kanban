export function excludeKeys<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  keys.forEach((key) => {
    delete obj[key];
  });
  return obj;
}
