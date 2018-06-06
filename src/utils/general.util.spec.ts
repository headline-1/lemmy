import { deepMerge, undefinedIfFalse } from './general.util';

describe('General utilities', () => {

  it('#undefinedIfFalse() should act as passthrough if value is not "false"', () => {
    expect(undefinedIfFalse('value')).toEqual('value');
  });

  it('#undefinedIfFalse() should return undefined if passed value is "false"', () => {
    expect(undefinedIfFalse('false')).toEqual(undefined);
  });

  it('#deepMerge() should merge nested objects correctly', () => {
    const obj1 = {
      a: {
        array: [1, 2, 3],
      },
      b: {
        nesting: {
          of: 'string',
          and: 123,
        },
      },
      d: 'abc',
    };
    const obj2 = {
      a: {
        array: [4, 5, 6],
      },
      b: {
        nesting: {
          of: 'string2',
          or: 456,
        },
      },
      c: 'str',
      d: undefined,
      e: null,
    };

    const mergedObjs = deepMerge<any>(obj1, obj2);
    expect(mergedObjs).toEqual({
      a: {
        array: [1, 2, 3, 4, 5, 6],
      },
      b: {
        nesting: {
          of: 'string2',
          and: 123,
          or: 456,
        },
      },
      c: 'str',
      d: 'abc',
      e: null,
    });
  });
});
