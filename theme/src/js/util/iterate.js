/// Iterate an array with delay
/// @link https://stackoverflow.com/a/45484448

const iterate = (array, fn, delay) => {
  let i = 0,
    // seed first call and store interval (to clear later)
    interval = setInterval(() => {
      // each loop, call passed in function
      fn(array[i]);
      // increment, and if we're past array, clear interval
      i++;
      if (i >= array.length - 1) {
        clearInterval(interval);
      }
    }, delay);
  return interval;
};

export default iterate;
