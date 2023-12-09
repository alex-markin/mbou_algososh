// libs
import React from "react";
import { useState } from "react";

// components & styles
import styles from "./fibonacci-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";

// utils & constants
import { getFibonacciNumbers } from "./utils";
import { DELAY_IN_MS } from "../../constants/delays";
import { MAX_INPUT_VALUE } from "../../constants/fibonacci";


export const FibonacciPage: React.FC = () => {

  const [inputValue, setInputValue] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderedItems, setRenderedItems] = useState<number[]>([]); // Added a new state to track rendered items

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= MAX_INPUT_VALUE) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };


  const handleClick = () => {
    if (!inputValue) return;
    renderedItems.length && setRenderedItems([]);
    try {
      setIsLoading(true);
      const result = getFibonacciNumbers(inputValue as number);
      renderItemsWithDelay(result);
      setRenderedItems([]);

    } catch (error) {
      console.log(error);
    }
  };

  const renderItemsWithDelay = (items: number[]) => {

    let renderedItems: number[] = [];

    items.forEach((item, index) => {
        setTimeout(() => {
          renderedItems = [...renderedItems, item];
          setRenderedItems(renderedItems);

          if (index === items.length - 1) {
            setIsLoading(false);
          }
        }, (index) * DELAY_IN_MS);
    });
  };


  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section className={styles.section}>
        <form id={'fib'} className={`${styles.inbutBlock}`}>
          <Input
            type="number"
            placeholder="Введите число"
            max={MAX_INPUT_VALUE}
            isLimitText={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
          />
          <Button
            text="Рассчитать"
            type="submit"
            onClick={handleClick}
            isLoader={isLoading}
            disabled={!inputValue} />
        </form>

        <div className={`${styles.outputBlock}`}>
          {renderedItems && renderedItems.map((item, index) => {
            return (
              <Circle
                key={index}
                letter={item.toString()}
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
