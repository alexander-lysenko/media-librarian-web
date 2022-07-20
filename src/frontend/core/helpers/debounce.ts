/**
 * A custom debounce() implementation to be used outside React components
 */
export function debounce(func: FunctionConstructor, timeout = 1000) {
  let timer: number;

  return (...args: never[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}
