// libs
import React, { useRef } from "react";
import { useState } from "react";

// components & styles
import styles from "./stack-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

// utils & constants
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Stack, TStack } from "./stack";

export const StackPage: React.FC = () => {

  const max = 4; // maximum value for input
  const stack = useRef<TStack<string>>(new Stack());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderedItems, setRenderedItems] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // index of active element


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= max) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };


  const push = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      stack.current.push(inputValue);
      const items = stack.current.getItems();
      setRenderedItems(items);
      setActiveIndex(items.length - 1);
      setTimeout(() => setActiveIndex(null), SHORT_DELAY_IN_MS);
      setInputValue("");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setIsLoading(false), SHORT_DELAY_IN_MS);
    }
  };

  const pop = () => {
    stack.current.pop();
    const items = stack.current.getItems();
    setRenderedItems(items);
    setActiveIndex(items.length - 1);
    setTimeout(() => setActiveIndex(null), SHORT_DELAY_IN_MS);
  }

  const reset = () => {
    stack.current.reset();
    setRenderedItems([]);
    setActiveIndex(0);
  }



  return (
    <SolutionLayout title="Стек">
      <section className={styles.section}>
        <form id={'stack'} className={`${styles.inbutBlock}`}>
          <Input
            value={inputValue}
            type="text"
            placeholder="Введите значение"
            maxLength={max}
            isLimitText={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
          />

          <Button
            text="Добавить"
            type="submit"
            onClick={push}
            isLoader={isLoading}
            disabled={!inputValue}
          />

          <Button
            text="Удалить"
            type="button"
            onClick={pop}
            disabled={renderedItems.length === 0 || isLoading}
          />

          <Button
            text="Очистить"
            type="reset"
            extraClass={styles.resetButton}
            onClick={reset}
            disabled={renderedItems.length === 0 || isLoading}

          />
        </form>

        <div className={`${styles.outputBlock}`}>
          {renderedItems.map((item, index, arr) => {
            return (
              <Circle
                state={index === activeIndex ? ElementStates.Changing : ElementStates.Default}
                key={index}
                letter={item.toString()}
                index={index}
                extraClass={styles.circle}
                head={index === arr.length - 1 ? "top" : ""}
              />
            );
          }
          )}
        </div>
      </section>

    </SolutionLayout>
  );
};
