export const getObjectDiff = (object1: any, object2: any) => {
  const object1Props = Object.keys(object1);
  const object2Props = Object.keys(object2);

  const keysWithDiffValue = object1Props.reduce(
    (keysWithDiffValueAccumulator, key) => {
      // eslint-disable-next-line no-prototype-builtins
      const propExistsOnObj2 = object2.hasOwnProperty(key);
      const hasNestedValue =
        object1[key] instanceof Object && object2[key] instanceof Object;
      const keyValuePairBetweenBothObjectsIsEqual =
        object1[key] === object2[key];

      if (!propExistsOnObj2) {
        keysWithDiffValueAccumulator.push(key);
      } else if (hasNestedValue) {
        const keyIndex = keysWithDiffValueAccumulator.indexOf(key);
        if (keyIndex >= 0) {
          keysWithDiffValueAccumulator.splice(keyIndex, 1);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nestedDiffs = getObjectDiff(object1[key], object2[key]);
        for (const diff of nestedDiffs) {
          keysWithDiffValueAccumulator.push(`${key}.${diff}`);
        }
      } else if (keyValuePairBetweenBothObjectsIsEqual) {
        const equalValueKeyIndex = keysWithDiffValueAccumulator.indexOf(key);
        keysWithDiffValueAccumulator.splice(equalValueKeyIndex, 1);
      }
      return keysWithDiffValueAccumulator;
    },
    object2Props
  );

  return keysWithDiffValue;
};
