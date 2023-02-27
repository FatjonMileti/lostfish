export const capitalize: (str: string) => string = (str: string) => {
  let ret: string = '';

  const split = str.split(' ');
  for (const word of split) {
    if (word && word.length > 0) {
      if (ret !== '') {
        ret += ' ';
      }
      ret += word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
  return ret;
};
