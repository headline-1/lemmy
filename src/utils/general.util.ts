export const undefinedIfFalse = (value: string): string => value === 'false' ? undefined : value;

export const deepMerge = <T extends object>(...objects: Partial<T>[]): T => {
  const result: any = {};
  Object.values(objects).forEach((object) => {
    Object.entries(object).forEach(([key, value]) => {
      const existingValue = result[key];
      if (value !== undefined && value !== null) {
        if (existingValue === undefined) {
          return result[key] = value;
        }
        if (Array.isArray(value) && Array.isArray(existingValue)) {
          result[key] = existingValue.concat(value);
        } else if (typeof value === 'object' && typeof existingValue === 'object') {
          result[key] = deepMerge(existingValue, value);
        } else {
          result[key] = value;
        }
      } else if (existingValue === undefined) {
        result[key] = value;
      }
    });
  });
  return result;
};
