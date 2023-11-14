import { Direction } from "../../types/direction";
import { SortingStep } from "../../types/sorting-step";

export function bubbleSorting(
  array: number[],
  direction: Direction
): SortingStep[] {
  const sortingSteps: SortingStep[] = [];
  let currentArray = [...array];
  let arrayLength = currentArray.length;

  for (let i = 0; i < arrayLength; i++) {
    let isSwapped = false;

    for (let j = 0; j < arrayLength - i - 1; j++) {
      if (
        (direction === Direction.Ascending &&
          currentArray[j] > currentArray[j + 1]) ||
        (direction === Direction.Descending &&
          currentArray[j] < currentArray[j + 1])
      ) {
        [currentArray[j], currentArray[j + 1]] = [
          currentArray[j + 1],
          currentArray[j],
        ];
        isSwapped = true;
      }

      // Обновляем шаги сортировки после каждого внутреннего цикла
      const step: SortingStep = {
        currentArray: [...currentArray],
        indexA: j,
        indexB: j + 1,
        sortedArray: i === 0 ? [] : currentArray.slice(-i),
      };
      sortingSteps.push(step);
    }

    if (!isSwapped) break; // Если обменов не произошло, массив уже отсортирован

    if (i === arrayLength - 2) {
      // Проверка для последнего элемента
      sortingSteps[sortingSteps.length - 1].sortedArray = [...currentArray];
    }

    // Добавляем шаг сортировки для окончательно отсортированного элемента
    sortingSteps.push({
      currentArray: [...currentArray],
      indexA: arrayLength - i - 1,
      indexB: arrayLength - i - 1,
      sortedArray: currentArray.slice(-i - 1),
    });
  }

  return sortingSteps;
}
