export const isValidEmail = (email: string) => {
  /* eslint-disable no-useless-escape */
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};
