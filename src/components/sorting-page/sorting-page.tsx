// libs
import React, { FormEvent, useEffect } from "react";
import { useState } from "react";

// components & styles
import styles from "./sorting-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { ArrayItem } from "../ui/array-item/array-item";
import { ElementStates } from "../../types/element-states";

// utils, constants & types
import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../constants/delays";
import { Direction } from "../../types/direction";
import { RadioTypes } from "../../types/radio-types";
import { selectionSorting, bubbleSorting } from "./utils";
import { isGlobalLoadingActive } from "../../utils/is-global-loading-active"
import { SortingStep } from "../../types/sorting-step";
import { MIN_LENGTH, MAX_LENGTH, MAX_VALUE, MAX_HEIGHT } from "../../constants/sorting";

export const SortingPage: React.FC = () => {

  const [radioValue, setRadioValue] = useState<RadioTypes>(RadioTypes.Selection);
  const [sortingDirection, setSortingDirection] = useState<Direction | null>(null);
  const [array, setArray] = useState<number[]>([]);

  const [sortingSteps, setSortingSteps] = useState<SortingStep[] | null>(null);
  const [activeIndexA, setActiveIndexA] = useState<number | null>(null);
  const [activeIndexB, setActiveIndexB] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // Добавляем состояние для текущего индекса шага


  const defaultLoadingStates = {
    ascending: false,
    descending: false,
  }

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>(defaultLoadingStates);

  const randomArray = () => {
    const array = [];
    setActiveIndexA(null);
    setActiveIndexB(null);
    setCurrentStepIndex(0);
    setSortingSteps(null);
    const length = Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1)) + MIN_LENGTH;
    for (let i = 0; i < length; i++) {
      array.push(Math.floor(Math.random() * MAX_VALUE));
    }
    return array;
  }


  const changeRadioValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === RadioTypes.Selection || e.target.value === RadioTypes.Bubble) {
      setRadioValue(e.target.value)
    }
  };

  const handleAscending = (e: FormEvent) => {
    e.preventDefault();
    setSortingDirection(Direction.Ascending);
  }

  const handleDescending = (e: FormEvent) => {
    e.preventDefault();
    setSortingDirection(Direction.Descending);
  }

  // SELECT SORT

  const selectSort = async (): Promise<void> => {
    setIsLoading({ ...defaultLoadingStates, [sortingDirection as string]: true });
    if (sortingDirection === null) return;

    let steps: SortingStep[] = selectionSorting(array, sortingDirection);

    const animateIndexB = async (start: number, end: number, nextStep: () => Promise<void>): Promise<void> => {
      if (start > end) {
        nextStep();
        return;
      }


      setActiveIndexB(start);
      await new Promise<void>((resolve) => setTimeout(resolve, DELAY_IN_MS / (end - start + 1)));
      animateIndexB(start + 1, end, nextStep);
    };

    const animateSortingStep = async (index: number): Promise<void> => {
      if (index >= steps.length) {
        setIsLoading(defaultLoadingStates);
        setSortingDirection(null);
        setActiveIndexA(null);
        setActiveIndexB(null);
        return;
      }

      const step = steps[index];
      setActiveIndexA(step.indexA);

      await animateIndexB(step.indexA + 1, step.indexB, async () => {
        setArray([...step.currentArray]);
        setSortingSteps(steps);
        setCurrentStepIndex(index);

        animateSortingStep(index + 1);
        await new Promise<void>((resolve) => setTimeout(resolve, DELAY_IN_MS));
      });
    };

    animateSortingStep(0);
  };

  // BUBBLE SORT
  const bubbleSort = async (): Promise<void> => {
    setIsLoading({ ...defaultLoadingStates, [sortingDirection as string]: true });
    if (sortingDirection === null) return;

    let steps: SortingStep[] = bubbleSorting(array, sortingDirection);

    const animateSortingStep = async (index: number): Promise<void> => {
      if (index >= steps.length) {
        setIsLoading(defaultLoadingStates);
        setSortingDirection(null);
        setActiveIndexA(null);
        setActiveIndexB(null);
        return;
      }

      const step = steps[index];
      setActiveIndexA(step.indexA);
      setActiveIndexB(step.indexB);
      setCurrentStepIndex(index);

      await new Promise<void>((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));
      setArray([...step.currentArray]);
      setSortingSteps(steps);

      await new Promise<void>((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));
      animateSortingStep(index + 1);
    };

    animateSortingStep(0);
  };



  const columnColor = (index: number): ElementStates => {
    const currentStep = sortingSteps ? sortingSteps[currentStepIndex] : null;

    if (currentStep) {
      if (currentStep.sortedArray.includes(array[index])) {
        return ElementStates.Modified;
      } else if (index === activeIndexA || index === activeIndexB) {
        return ElementStates.Changing;
      }
    }

    if (currentStepIndex === (sortingSteps?.length ?? 0) - 1) {
      return ElementStates.Modified;
    }

    return ElementStates.Default;
  };


  useEffect(() => {
    setArray(randomArray());
  }, []);

  useEffect(() => {
    if (sortingDirection !== null) {
      if (radioValue === RadioTypes.Selection) {
        selectSort();
      } else if (radioValue === RadioTypes.Bubble) {
        bubbleSort();
      }
    }
  }, [sortingDirection, radioValue]);




  return (
    <SolutionLayout title="Сортировка массива">
      <section className={styles.section}>
        <form id={'sorting'} className={`${styles.inbutBlock}`}>

          <fieldset className={styles.radioBlock}>
            <RadioInput
              label="Выбор"
              name="radioSelection"
              value="selectionSort"
              onChange={changeRadioValue}
              checked={radioValue === "selectionSort"}
            />

            <RadioInput
              label="Пузырёк"
              name="radioBubble"
              value="bubbleSort"
              onChange={changeRadioValue}
              checked={radioValue === "bubbleSort"}

            />

          </fieldset>

          <fieldset className={styles.sortSelectionBlock}>

            <Button
              text="По возрастанию"
              name={Direction.Ascending}
              sorting={Direction.Ascending}
              extraClass={styles.sortingButton}
              type="button"
              onClick={handleAscending}
              isLoader={isLoading.ascending}
              disabled={isGlobalLoadingActive(isLoading)}
            />

            <Button
              text="По убыванию"
              name={Direction.Descending}
              sorting={Direction.Descending}
              type="button"
              extraClass={styles.sortingButton}
              onClick={handleDescending}
              isLoader={isLoading.descending}
              disabled={isGlobalLoadingActive(isLoading)}

            />
          </fieldset>

          <Button
            text="Новый массив"
            type="reset"
            extraClass={styles.sortingButton}
            onClick={() => setArray(randomArray())}
            disabled={isGlobalLoadingActive(isLoading)}

          />

        </form>

        <div className={`${styles.outputBlock}`}>
          {array.map((item, index) => {
            return (
              <ArrayItem
                key={index}
                color={columnColor(index)}
                height={Math.floor((item * MAX_HEIGHT) / 100)}
              />
            )
          })}
        </div>
      </section>
    </SolutionLayout>
  );
};
