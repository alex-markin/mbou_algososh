import React, { useEffect, useRef } from "react";
import { useState } from "react";

// components & styles
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import Arrow from "./arrow"

// utils & constants & types
import { DELAY_IN_MS, SHORT_DELAY_IN_MS } from "../../constants/delays";
import { LinkedList, TLinkedList, Node } from "../../services/algrorithms/linked-list";
import { SubCircle } from "../../types/insterted-circle";

export const ListPage: React.FC = () => {


  // states & refs
  const maxLength = 7; // maximum length of the list
  const inputLength = 4; // maximum value for inputValue
  const maxIndex = maxLength - 1; // maximum value for indexValue
  const initialValues = ["0", "34", "85", "65"]; // initial values for the list

  const linkedList = useRef<TLinkedList<string>>(new LinkedList(maxLength));
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState<number | null>(null); // index of element to add or remove

  const defaultLoadingState = {
    prepend: false,
    append: false,
    deleteHead: false,
    deleteTail: false,
    insertIndex: false,
    removeIndex: false,
  };
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>(defaultLoadingState);
  const [filledCircles, setFilledCircles] = useState<string[]>([]);

  const [tailIndex, setTailIndex] = useState<number | null>(0); // index of tail element
  const [headIndex, setHeadIndex] = useState<number | null>(0); // index of head element

  const [changingIndex, setChangingIndex] = useState<number | null>(null); // index of active element
  const [changingIndexes, setChangingIndexes] = useState<number[]>([]); // index of active element

  const [modifiedIndex, setModifiedIndex] = useState<number | null>(null); // index of modified element


  const [subCircle, setSubCircle] = useState<SubCircle>({
    direction: "",
    component: null,
  });
  const [subCircleIndexes, setSubCircleIndexes] = useState<number[]>([]); // index of subCircle element for insertAtIndex method



  useEffect(() => {
    setFilledCircles([]);
    linkedList.current.clean();
    initialValues.forEach((item) => {
      linkedList.current.append(item);
    })
    setFilledCircles(linkedList.current.getItems() as string[]);
    setTailIndex(linkedList.current.getTailIndex());
    setHeadIndex(0);
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setIndexValue(null);
    } else {
      const numericValue = Number(value);
      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxIndex) {
        setIndexValue(numericValue);
      }
    }
  };

  const addElement = (e: React.FormEvent, method: string) => {
    e.preventDefault();
    if (!inputValue) return;
    if (tailIndex === maxLength - 1) {
      setInputValue("Превышен лимит очереди")
      return;
    };
    try {
      if (method === "prepend") {
        linkedList.current.prepend(inputValue);
        setIsLoading({ ...isLoading, prepend: true });
      } else if (method === "append") {
        linkedList.current.append(inputValue);
        setIsLoading({ ...isLoading, append: true });

      }

      // starting actions

      const items = linkedList.current.getItems();
      setChangingIndex(method === "prepend" ? 0 : filledCircles.length - 1);

      setSubCircle({
        direction: method,
        component: (
          <Circle
            state={ElementStates.Changing}
            letter={inputValue}
            isSmall={true}
          />
        ),
      });

      // ending actions
      setTimeout(() => {
        // updating states
        setFilledCircles([...items as string[]]);
        setTailIndex(linkedList.current.getTailIndex());
        setModifiedIndex(method === "prepend" ? 0 : items.length - 1);

        // reseting states
        setChangingIndex(null);
        setSubCircle({ direction: "", component: null });
        setInputValue("");
      }, DELAY_IN_MS)

    } catch (error) {
      console.log(error)
    } finally {
      // reseting states
      setTimeout(() => setIsLoading(defaultLoadingState), DELAY_IN_MS);
      setTimeout(() => setModifiedIndex(null), DELAY_IN_MS * 2);
    }
  };

  const deleteItem = (method: string) => {

    let deletedItem: Node<string> | null = null;

    if (method === "deleteHead") {
      deletedItem = linkedList.current.deleteHead();
      setIsLoading({ ...isLoading, deleteHead: true });
    } else if (method === "deleteTail") {
      deletedItem = linkedList.current.deleteTail();
      setIsLoading({ ...isLoading, deleteTail: true });
    }
    try {
      // starting actions
      const currentArr = filledCircles;
      if (method === "deleteHead") {
        currentArr[0] = "";
      } else if (method === "deleteTail") {
        currentArr[currentArr.length - 1] = "";
      }
      setFilledCircles([...currentArr]);
      setChangingIndex(method === "deleteHead" ? 0 : filledCircles.length - 1);

      setSubCircle({
        direction: method,
        component: (
          <Circle
            state={ElementStates.Changing}
            letter={deletedItem?.value as string}
            isSmall={true}
          />
        ),
      });

      // ending actions
      setTimeout(() => {
        // updating states
        setFilledCircles([...linkedList.current.getItems() as string[]]);
        setTailIndex(linkedList.current.getTailIndex());
        setHeadIndex(0);


        // reseting states
        setChangingIndex(null);
        setSubCircle({ direction: "", component: null });
      }, DELAY_IN_MS)

    } catch (error) {
      console.log(error)
    } finally {
      // reseting states
      setTimeout(() => setIsLoading(defaultLoadingState), DELAY_IN_MS);
    }
  }

  const addByIndex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || indexValue === null) return;
    if (tailIndex === maxLength - 1) {
      setInputValue("Превышен лимит очереди");
      return;
    };

    setIsLoading({ ...isLoading, insertIndex: true });


    setSubCircle({
      direction: "insertAtIndex",
      component: (
        <Circle
          state={ElementStates.Changing}
          letter={inputValue}
          isSmall={true}
        />
      ),
    });



    for (let i = 0; i <= indexValue; i++) {
      setTimeout(() => {
        setSubCircleIndexes((prev) => [...prev, i]);
      }, SHORT_DELAY_IN_MS * i);

      setTimeout(() => {
        setChangingIndexes((prev) => [...prev, i]);

        if (i === indexValue) {

          // insert element
          setTimeout(() => {
            linkedList.current.insertAt(inputValue, indexValue);
            const items = linkedList.current.getItems();
            setFilledCircles([...items as string[]]);
            setTailIndex(linkedList.current.getTailIndex());
            setModifiedIndex(indexValue);

            // Сброс состояний
            setChangingIndex(null);
            setSubCircle({ direction: "", component: null });
            setInputValue("");
            setIndexValue(null);
            setChangingIndexes([]);
            setIsLoading(defaultLoadingState);
            setTimeout(() => { setModifiedIndex(null) }, DELAY_IN_MS);
          }, DELAY_IN_MS);
        }
      }, DELAY_IN_MS * i);
    }
  };

  const deleteByIndex = (e: React.FormEvent) => {
    e.preventDefault();
    if (indexValue === null || indexValue < 0 || indexValue >= filledCircles.length) {
      setInputValue("Неверный индекс");
      return;
    };

    setIsLoading({ ...isLoading, removeIndex: true });

    // Animation for iterating through the elements until the deletion index
    for (let i = 0; i <= indexValue; i++) {
      setTimeout(() => {
        setChangingIndexes((prev) => [...prev, i]);
        if (i === indexValue) {
          const deletedElement = linkedList.current.deleteAt(indexValue);
          setChangingIndex(i);
          const currentArr = filledCircles;
          currentArr[indexValue] = "";
          setFilledCircles([...currentArr]);
          setSubCircle({
            direction: "deleteAtIndex",
            component: (
              <Circle
                state={ElementStates.Changing}
                letter={deletedElement?.value || ''}
                isSmall={true}
              />
            ),
          });

          // Delete element after slight delay to show subCircle at the deletion point
          setTimeout(() => {
            const items = linkedList.current.getItems();
            setFilledCircles([...items as string[]]);
            setSubCircle({ direction: "", component: null });
            setChangingIndexes([]);
            setChangingIndex(null);
            setTailIndex(linkedList.current.getTailIndex());



            // Сброс состояний
            setTimeout(() => {
              setInputValue("");
              setIndexValue(null);
              setIsLoading(defaultLoadingState);
            }, SHORT_DELAY_IN_MS);
          }, DELAY_IN_MS);
        }
      }, SHORT_DELAY_IN_MS * i);
    }
  };


  const setHeadState = (index: number) => {
    const isLastChangingIndex = index === subCircleIndexes[subCircleIndexes.length - 1];

    if (index === headIndex && subCircle.direction === "prepend") {
      return subCircle.component;
    } else if (index === headIndex && subCircle.direction === "deleteHead") {
      return subCircle.component
    } else if (isLastChangingIndex && subCircle.direction === "insertAtIndex") {
      return subCircle.component;
    } else if (index === headIndex) {
      return 'head';
    }
  }


  const setTailState = (index: number) => {
    if (index === tailIndex && subCircle.direction === "append") {
      return subCircle.component;
    } else if (index === tailIndex && subCircle.direction === "deleteTail") {
      return subCircle.component
    } else if (index === changingIndex && subCircle.direction === "deleteAtIndex") {
      return subCircle.component;
    } else if (index === tailIndex) {
      return 'tail';
    }
  }


  const setCircleColor = (index: number) => {
    if (index === modifiedIndex) {
      return ElementStates.Modified;
    } else if (index === changingIndex) {
      return ElementStates.Changing;
    } else if (changingIndexes.includes(index)) {
      return ElementStates.Changing;
    } else {
      return ElementStates.Default;
    }
  }




  return (
    <SolutionLayout title="Связный список">
      <section className={styles.section}>
        <form id={'queue'} className={`${styles.inbutBlock}`}>
          <fieldset className={styles.fieldset}>
            <Input
              value={inputValue}
              type="text"
              placeholder="Введите значение"
              maxLength={inputLength}
              isLimitText={true}
              extraClass={styles.listInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
            <Button
              text="Добавить в head"
              type="submit"
              linkedList="small"
              onClick={(e: React.FormEvent) => addElement(e, "prepend")}
              isLoader={isLoading.prepend}
              disabled={tailIndex === maxLength - 1 || !inputValue ? true : false}
            />
            <Button
              text="Добавить в tail"
              type="submit"
              linkedList="small"
              onClick={(e: React.FormEvent) => addElement(e, "append")}
              isLoader={isLoading.append}
              disabled={tailIndex === maxLength - 1 || !inputValue ? true : false}
            />
            <Button
              text="Удалить из head"
              type="button"
              linkedList="small"
              isLoader={isLoading.deleteHead}
              disabled={filledCircles.length === 0 ? true : false}
              onClick={(e) => deleteItem("deleteHead")}
            />
            <Button
              text="Удалить из tail"
              type="reset"
              linkedList="small"
              isLoader={isLoading.deleteTail}
              onClick={(e) => deleteItem("deleteTail")}
              disabled={filledCircles.length === 0 ? true : false}

            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <Input
              type="number"
              max={maxIndex}
              value={indexValue !== null ? indexValue : ''}
              placeholder="Введите индекс"
              extraClass={styles.listInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndexChange(e)}
            />
            <Button
              text="Добавить по индексу"
              type="submit"
              linkedList="big"
              onClick={(e: React.FormEvent) => addByIndex(e)}
              isLoader={isLoading.insertIndex}
              disabled={indexValue === null || !inputValue || indexValue > filledCircles.length - 1 ? true : false}

            />
            <Button
              text="Удалить по индексу"
              type="button"
              linkedList="big"
              isLoader={isLoading.removeIndex}
              disabled={indexValue === null || filledCircles.length === 0 || indexValue > filledCircles.length - 1 ? true : false}
              onClick={(e: React.FormEvent) => deleteByIndex(e)}
            />

          </fieldset>
        </form>
        <div className={`${styles.outputBlock}`}>
          {filledCircles.map((item, index) => {
            return (
              <div key={index} className={styles.circleBlock}>
                <Circle
                  state={setCircleColor(index)}
                  letter={item}
                  index={index}
                  tail={setTailState(index)}
                  head={setHeadState(index)}
                />
                <Arrow
                  index={index}
                  tailIndex={tailIndex ? tailIndex : 0}
                />

              </div>
            );
          })}
        </div>
      </section>
    </SolutionLayout>
  );
};
