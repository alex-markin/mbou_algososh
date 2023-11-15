export type TStack<T> = {
  push: (item: T) => void;
  pop: () => void;
  reset: () => void;
  getItems: () => T[];
  getSize: () => number;
};

export class Stack<T> implements TStack<T> {
  private container: T[] = [];

  push = (item: T): void => {
    this.container.push(item);
  };

  pop = (): void => {
    this.container.length > 0 && this.container.pop();
  };

  reset = (): void => {
    this.container = [];
  };

  getItems = (): T[] => {
    return this.container;
  };

  getSize = (): number => {
    return this.container.length - 1;
  }
  
}
