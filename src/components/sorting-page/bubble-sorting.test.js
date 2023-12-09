import { bubbleSorting } from './utils';
import { Direction } from '../../types/direction';


describe('bubbleSorting function', () => {
  it('should correctly sort an empty array', () => {
    const inputArray = [];
    const expectedRes = [];

    const resAscending = bubbleSorting(inputArray, Direction.Ascending);
    const resDescending = bubbleSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(expectedRes);
    expect(resDescending).toEqual(expectedRes);
  });

  it('should correctly sort an array with length === 1', () => {
    const inputArray = [1];
    const expectedRes = [{ "currentArray": [1], "indexA": 0, "indexB": 0, "sortedArray": [1] },
    ];

    const resAscending = bubbleSorting(inputArray, Direction.Ascending);
    const resDescending = bubbleSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(expectedRes);
    expect(resDescending).toEqual(expectedRes);
  });

  it('should correctly sort an array with multiple elements', () => {
    const inputArray = [1, 2, 3];
    const expectedResAscending = [
      { "currentArray": [1, 2, 3], "indexA": 0, "indexB": 1, "sortedArray": [] },
      { "currentArray": [1, 2, 3], "indexA": 1, "indexB": 2, "sortedArray": [] }
    ];

    const expectedResDescending = [
      { "currentArray": [2, 1, 3], "indexA": 0, "indexB": 1, "sortedArray": [] },
      { "currentArray": [2, 3, 1], "indexA": 1, "indexB": 2, "sortedArray": [] },
      { "currentArray": [2, 3, 1], "indexA": 2, "indexB": 2, "sortedArray": [1] },
      { "currentArray": [3, 2, 1], "indexA": 0, "indexB": 1, "sortedArray": [3, 2, 1] },
      { "currentArray": [3, 2, 1], "indexA": 1, "indexB": 1, "sortedArray": [2, 1] }
    ];

    const resAscending = bubbleSorting(inputArray, Direction.Ascending);
    const resDescending = bubbleSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(expectedResAscending);
    expect(resDescending).toEqual(expectedResDescending);
  });

});
