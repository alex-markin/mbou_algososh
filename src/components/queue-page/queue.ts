export type TQueue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  getItems: () => (T | null)[];
  isEmpty: () => boolean;
  getSize: () => number;
  getHead: () => number;
  getTail: () => number;
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

  getTail = (): number => {
    // Adjust to return the index of the last item
    return this.length === 0 ? 0 : (this.tail - 1 + this.size) % this.size;
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
    let items = Array(this.size).fill(null);
    for (let i = 0; i < this.length; i++) {
      let index = (this.head + i) % this.size;
      items[index] = this.container[index];
    }
    return items;
  };

  getSize = (): number => {
    return this.size;
  };

  getHead = (): number => {
    return this.head;
  };

  isEmpty = () => this.length === 0;

  reset = (): void => {
    this.container = [];
    this.length = 0;
    this.head = 0;
    this.tail = 0;
    this.container = Array(this.size).fill(null);
  };

  getLength = (): number => {
    return this.length;
  };
}
