export const sliceArrayIntoChunks = (array: Array<any>, chunkSize: number) => {
  const result: Array<any> = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
};
