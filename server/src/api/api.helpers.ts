export interface AnyObject {
  [key: string]: any;
}

export const areArraysOfObjectsIdentical = (arr1: AnyObject[], arr2: AnyObject[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    if (!isObjectEqual(obj1, obj2)) {
      return false;
    }
  }

  return true;
};

export const isObjectEqual = (obj1: AnyObject, obj2: AnyObject): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};
