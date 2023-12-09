// libs
import React, { useEffect } from "react";

// components & styles
import styles from "./string.module.css";
import { ElementStates } from "../../types/element-states";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useState } from "react";
import { Circle } from "../ui/circle/circle";

// utils & constants
import { DELAY_IN_MS } from "../../constants/delays";
import { stringSort, getColorClass } from "./utils";
import { MAX_LENGTH } from "../../constants/string";


export const StringComponent: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<string[]>([]);

  const [startStepIndex, setStartStepIndex] = useState<number>(0);
  const [endStepIndex, setEndStepIndex] = useState<number>(0);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    try {
      setIsLoading(true);
      const steps = stringSort(inputValue);

      let currentIndex = 0;
      setStartStepIndex(0);
      setEndStepIndex(steps[0].length - 1);

      while (currentIndex < steps.length) {
        const step = steps[currentIndex];
        const iterations = Math.ceil((step.length - 1) / 2);

        if (step) {
          setCurrentItem(step);
          currentIndex++;
          await new Promise((resolve) => setTimeout(resolve, DELAY_IN_MS));

          setStartStepIndex((prevStart) =>
            prevStart < iterations ? prevStart + 1 : prevStart
          );

          setEndStepIndex((prevEnd) =>
            prevEnd > iterations ? prevEnd - 1 : prevEnd
          );
        }

      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setInputValue('');

    }
  };


  return (
    <SolutionLayout title="Строка">
      <section className={styles.section}>
        <form id={'string'} className={`${styles.inbutBlock}`}>
          <Input
            type="text"
            value={inputValue}
            placeholder="Введите число"
            maxLength={MAX_LENGTH}
            isLimitText={true}
            onChange={handleInput}
          />
          <Button
            text="Развернуть"
            type="submit"
            onClick={handleClick}
            isLoader={isLoading}
            disabled={!inputValue} />
        </form>

        <div className={`${styles.outputBlock}`}>
          {currentItem && currentItem.map((item, index) => {
            return (
              <Circle
                state={getColorClass(index, startStepIndex, endStepIndex)}
                key={index}
                letter={item}
                index={index}
                extraClass={styles.circle}
              />
            );
          }
          )}

        </div>
      </section>
    </SolutionLayout>
  );
};
