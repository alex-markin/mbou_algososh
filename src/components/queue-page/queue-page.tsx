import React, { useEffect, useRef } from "react";
import { useState } from "react";

// components & styles
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

// utils & constants
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Queue, TQueue } from "../../services/algrorithms/queue";

export const QueuePage: React.FC = () => {
  const circlesCount = 4; // maximum count of circles
  const max = 4; // maximum value for input

  const queue = useRef<TQueue<string>>(new Queue(circlesCount));
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filledCircles, setFilledCircles] = useState<string[]>(new Array(circlesCount).fill(''));
  const [tailIndex, setTailIndex] = useState<number>(0); // index of tail element
  const [headIndex, setHeadIndex] = useState<number | null>(null); // index of head element
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // index of active element

  useEffect(() => {
    const initialFilledCircles = new Array(circlesCount).fill('');
    setFilledCircles(initialFilledCircles);
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= max) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };

  const enqueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    if (tailIndex === circlesCount - 1) {
      setInputValue("Превышен лимит очереди")
      return;
    };

    setIsLoading(true);
    try {
      queue.current.enqueue(inputValue);
      const items = queue.current.getItems();
      const nextEmptyIndex = filledCircles.findIndex((item) => item === undefined || item === '');
      if (nextEmptyIndex !== -1) {
        filledCircles[nextEmptyIndex] = inputValue;
        setActiveIndex(nextEmptyIndex);
        setTimeout(() => {
          setTailIndex(nextEmptyIndex);
          setFilledCircles([...items as string[]]);
          setActiveIndex(null);
        }, SHORT_DELAY_IN_MS)
        setInputValue("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setIsLoading(false), SHORT_DELAY_IN_MS);
    }
  };

  const dequeue = () => {
    queue.current.dequeue();
    const items = queue.current.getItems();
    setActiveIndex(headIndex ? headIndex : 0);
    setTimeout(() => {
      setFilledCircles([...items as string[]]);
      setTimeout(() => setActiveIndex(null), SHORT_DELAY_IN_MS);
      setHeadIndex(headIndex ? headIndex + 1 : 1);
      setActiveIndex(null);
    }, SHORT_DELAY_IN_MS);
  }

  const reset = () => {
    setActiveIndex(null);
    setHeadIndex(null);
    setTailIndex(0);
    queue.current.reset();
    setFilledCircles(new Array(circlesCount).fill(''));
  }

  return (
    <SolutionLayout title="Очередь">
      <section className={styles.section}>
        <form id={'queue'} className={`${styles.inbutBlock}`}>
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
            onClick={enqueue}
            isLoader={isLoading}
          />
          <Button
            text="Удалить"
            type="button"
            onClick={dequeue}
          />
          <Button
            text="Очистить"
            type="reset"
            extraClass={styles.resetButton}
            onClick={reset}

          />
        </form>
        <div className={`${styles.outputBlock}`}>
          {filledCircles.map((item, index) => {
            return (
              <Circle
                state={index === activeIndex ? ElementStates.Changing : ElementStates.Default}
                key={index}
                letter={item}
                index={index}
                extraClass={styles.circle}
                tail={index === tailIndex && item ? "tail" : undefined}
                head={index === headIndex && item ? "head" : undefined}
              />
            );
          })}
        </div>
      </section>
    </SolutionLayout>
  );
};
