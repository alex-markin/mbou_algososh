export type TQueue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  getItems: () => (T | null)[];
  isEmpty: () => boolean;
  getSize: () => number;
  reset: () => void;
  getLength: () => number;
};

export class Queue<T> implements TQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }

    this.container[this.tail] = item;
    this.tail = (this.tail + 1) % this.size;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }

    const item = this.container[this.head];
    this.container[this.head] = null;
    this.head = (this.head + 1) % this.size;
    this.length--;
    return item;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.container[this.head];
  };

  getItems = (): (T | null)[] => {
    return this.container;
  };

  getSize = (): number => {
    return this.size;
  };

  isEmpty = () => this.length === 0;

  reset = (): void => {
    this.container = [];
    this.length = 0;
    this.head = 0;
    this.tail = 0;
  };

  getLength = (): number => {
    return this.length;
  };
}
