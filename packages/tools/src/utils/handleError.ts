export const handleError = (error: any, debug: boolean): boolean => {
  if (debug) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.error(error.config);
  }
  console.error(error.response.data);
  console.error(
    `\nERROR SUMMARY: ${error.response.status}: ${error.response.statusText}\n`
  );
  return false;
};
