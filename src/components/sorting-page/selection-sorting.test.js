import { selectionSorting } from './utils';
import { Direction } from '../../types/direction';


describe('selectionSorting function', () => {
  it('should correctly sort an empty array', () => {
    const inputArray = [];
    const expectedRes = [];

    const resAscending = selectionSorting(inputArray, Direction.Ascending);
    const resDescending = selectionSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(expectedRes);
    expect(resDescending).toEqual(expectedRes);
  });

  it('should correctly sort an array with length === 1', () => {
    const inputArray = [1];
    const expectedRes = [{ "currentArray": [1], "indexA": 0, "indexB": 0, "sortedArray": [1] },
    ];

    const resAscending = selectionSorting(inputArray, Direction.Ascending);
    const resDescending = selectionSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(expectedRes);
    expect(resDescending).toEqual(expectedRes);
  });

  it('should correctly sort an array with multiple elements', () => {
    const inputArray = [1, 2, 3];
    const expectedResAscending = [
      { "currentArray": [1, 2, 3], "indexA": 0, "indexB": 0, "sortedArray": [1] },
      { "currentArray": [1, 2, 3], "indexA": 1, "indexB": 1, "sortedArray": [1, 2] },
      { "currentArray": [1, 2, 3], "indexA": 2, "indexB": 2, "sortedArray": [1, 2, 3] }
    ];

    const expectedResDescending = [
      { "currentArray": [3, 2, 1], "indexA": 0, "indexB": 2, "sortedArray": [3] },
      { "currentArray": [3, 2, 1], "indexA": 1, "indexB": 1, "sortedArray": [3, 2] },
      { "currentArray": [3, 2, 1], "indexA": 2, "indexB": 2, "sortedArray": [3, 2, 1] }
    ]

    const resAscending = selectionSorting(inputArray, Direction.Ascending);
    const resDescending = selectionSorting(inputArray, Direction.Descending);

    expect(resAscending).toEqual(resAscending);
    expect(resDescending).toEqual(expectedResDescending);
  });

});
