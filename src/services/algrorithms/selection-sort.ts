import { Direction } from "../../types/direction";
import { SortingStep } from "../../types/sorting-step";

export function selectionSorting(
  array: number[],
  direction: Direction
): SortingStep[] {
  const sortingSteps: SortingStep[] = [];
  let currentArray = [...array];
  let sortedArray = [];
  let arrayLength = currentArray.length;

  for (let i = 0; i < arrayLength; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arrayLength; j++) {
      if (direction === Direction.Ascending) {
        if (currentArray[minIndex] > currentArray[j]) {
          minIndex = j;
        }
      } else {
        if (currentArray[minIndex] < currentArray[j]) {
          minIndex = j;
        }
      }
    }
    let temp = currentArray[i];
    currentArray[i] = currentArray[minIndex];
    currentArray[minIndex] = temp;
    sortedArray.push(currentArray[i]);

    const step: SortingStep = {
      currentArray: [...currentArray],
      indexA: i,
      indexB: minIndex,
      sortedArray: [...sortedArray],
    };

    sortingSteps.push(step);
  }

  return sortingSteps;
}
