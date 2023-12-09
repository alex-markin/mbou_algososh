import { ElementStates } from "../../types/element-states";


export const stringSort = (string: string) => {
  const initialArr = string.split("");
  const steps: string[][] = [[...initialArr]];

  if (initialArr.length <= 1) {
    return steps;
  }

  const iterations = Math.ceil((initialArr.length - 1) / 2);

  for (let left = 0; left < iterations; left++) {
    const right = initialArr.length - 1 - left;
    const temp = initialArr[left];

    initialArr[left] = initialArr[right];
    initialArr[right] = temp;

    steps.push([...initialArr]);
  }
  return steps;
};

export const getColorClass = (
  index: number,
  startStepIndex: number,
  endStepIndex: number
): ElementStates => {
  if (
    index < startStepIndex ||
    index > endStepIndex ||
    (startStepIndex === endStepIndex && index === startStepIndex)
  ) {
    return ElementStates.Modified;
  }

  if (index === startStepIndex || index === endStepIndex) {
    return ElementStates.Changing;
  }

  if (index > startStepIndex && index < endStepIndex) {
    return ElementStates.Default;
  }

  return ElementStates.Default; // or any default value as per your logic
};
