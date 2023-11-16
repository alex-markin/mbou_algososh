export class Node<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

export type TLinkedList<T> = {
  append: (element: T) => void;
  prepend: (element: T) => void;
  deleteHead: () => Node<T> | null;
  deleteTail: () => Node<T> | null;
  getItems: () => (T | null)[];
  getSize: () => number;
  getTailIndex: () => number;
  insertAt: (element: T, index: number) => void;
  deleteAt: (index: number) => Node<T> | null;
  clean: () => void;
};

export class LinkedList<T> implements TLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;
  private length: number;
  constructor(length: number) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.length = length;
  }

  append(element: T) {
    const node = new Node(element);

    if (!this.head || !this.tail) {
      this.head = node;
      this.tail = node;
      return this;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.size++;
  }

  prepend(element: T) {
    const node = new Node(element);
    node.next = this.head;
    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }

    this.size++;
    return this;
  }

  insertAt(element: T, index: number) {
    if (index < 0 || index > this.size) {
      return null;
    }

    if (index === 0) {
      return this.prepend(element);
    }

    const node = new Node(element);
    let currentNode = this.head;
    let previousNode = null;
    let currentIndex = 0;

    while (currentIndex < index) {
      previousNode = currentNode;
      if (currentNode) {
        currentNode = currentNode.next;
      }
      currentIndex++;
    }

    if (previousNode && currentNode) {
      node.next = currentNode;
      previousNode.next = node;
      this.size++;
    }

    return this;
  }

  deleteAt(index: number): Node<T> | null {
    let currentNode = this.head;
    let previousNode = null;

    if (index < 0 || index > this.size) {
      return null;
    }

    if (index === 0) {
      this.head = currentNode?.next || null;
      this.size--;
      return currentNode;
    }

    let currentIndex = 0;

    while (currentIndex < index) {
      previousNode = currentNode;
      if (currentNode) {
        currentNode = currentNode.next;
      }
      currentIndex++;
    }

    if (previousNode && currentNode) {
      previousNode.next = currentNode.next;
      this.size--;
    }

    return currentNode;
  }

  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size--;
    return deletedHead;
  }

  deleteTail() {
    if (!this.tail) {
      return null;
    }

    const deletedTail = this.tail;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return deletedTail;
    }

    let currentNode = this.head;

    while (currentNode?.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;
    this.size--;
    return deletedTail;
  }

  getItems() {
    const items: (T | null)[] = [];
    let currentNode = this.head;

    while (currentNode) {
      items.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return items;
  }

  getSize() {
    return this.size;
  }

  getTailIndex() {
    return this.size;
  }

  clean() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}
