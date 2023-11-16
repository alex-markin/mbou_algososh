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
import { Queue, TQueue } from "./queue";
import { CIRCLES_COUNT, MAX_INPUT_VALUE } from "../../constants/queue";

export const QueuePage: React.FC = () => {

  const queue = useRef<TQueue<string>>(new Queue(CIRCLES_COUNT));
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filledCircles, setFilledCircles] = useState<string[]>(new Array(CIRCLES_COUNT).fill(''));
  const [tailIndex, setTailIndex] = useState<number | null>(0); // index of tail element
  const [headIndex, setHeadIndex] = useState<number | null>(null); // index of head element
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // index of active element

  useEffect(() => {
    const initialFilledCircles = new Array(CIRCLES_COUNT).fill('');
    setFilledCircles(initialFilledCircles);
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_VALUE) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };

  const enqueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);
    try {
      queue.current.enqueue(inputValue);
      if (queue.current.getLength() === 1) {
        setHeadIndex(0);
        setTailIndex(0);
      } else {
        setTailIndex(queue.current.getTail());
      }
      const activeIndex = queue.current.getTail();
      setActiveIndex(activeIndex);

      await new Promise<void>((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));

      const items = queue.current.getItems().map(item => item ?? '');
      setFilledCircles(items as string[]);


      setInputValue("");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), SHORT_DELAY_IN_MS);
      setActiveIndex(null);
    }
  };

  const dequeue = () => {
    queue.current.dequeue();
    const items = queue.current.getItems();
    setActiveIndex(headIndex ?? 0);
    setTimeout(() => {
      setFilledCircles([...items as string[]]);
      setTimeout(() => setActiveIndex(null), SHORT_DELAY_IN_MS);
      // Adjust headIndex and check if queue is empty
      if (queue.current.isEmpty()) {
        setHeadIndex(null);
        setTailIndex(null);
      } else {
        setHeadIndex((headIndex ?? 0) + 1);
      }
      setActiveIndex(null);
    }, SHORT_DELAY_IN_MS);
  }

  const reset = () => {
    setActiveIndex(null);
    setHeadIndex(null);
    setTailIndex(0);
    queue.current.reset();
    setFilledCircles(new Array(CIRCLES_COUNT).fill(''));
  }

  useEffect(() => {
    console.log(activeIndex, headIndex, tailIndex);
  }, [activeIndex, headIndex, tailIndex])

  return (
    <SolutionLayout title="Очередь">
      <section className={styles.section}>
        <form id={'queue'} className={`${styles.inbutBlock}`}>
          <Input
            value={inputValue}
            type="text"
            placeholder="Введите значение"
            maxLength={MAX_INPUT_VALUE}
            isLimitText={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
          />
          <Button
            text="Добавить"
            type="submit"
            onClick={enqueue}
            isLoader={isLoading}
            disabled={!inputValue}
          />
          <Button
            text="Удалить"
            type="button"
            onClick={dequeue}
            disabled={filledCircles.every((item) => item === '' || item === undefined || isLoading)}
          />
          <Button
            text="Очистить"
            type="reset"
            extraClass={styles.resetButton}
            onClick={reset}
            disabled={filledCircles.every((item) => item === '' || item === undefined || isLoading)}

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
                tail={index === tailIndex && item !== '' ? "tail" : undefined}
                head={index === headIndex && item !== '' ? "head" : undefined}
              />
            );
          })}
        </div>
      </section>
    </SolutionLayout>
  );
};
