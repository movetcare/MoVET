export const sortDataBy = (data: any, byKey: string) => {
  let sortedData;
  sortedData = data.sort((a: any, b: any) => {
    let x = a[byKey]?.toLowerCase();
    let y = b[byKey]?.toLowerCase();
    if (x > y) {
      return 1;
    }
    if (x < y) {
      return -1;
    }
    return 0;
  });
  return sortedData;
};
