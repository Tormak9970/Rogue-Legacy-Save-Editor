/**
 *
 * @param func The function to throttle
 * @param wait The amount of time in between each run
 * @returns A function that throttles the provided function
 */
export function throttle(func: any, wait: number) {
  let waiting = false;
  return function () {
    if (waiting) {
      return;
    } else {
      func.apply(this, arguments);
    }

    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, wait);
  };
}

export function isSaveFile(fileName:string): boolean {
  return false;
}