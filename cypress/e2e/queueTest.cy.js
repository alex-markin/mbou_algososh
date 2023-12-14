
import { ROUTES, testURL } from '../../src/constants/routes';
import { Queue } from '../../src/components/queue-page/queue';
import { MAX_INPUT_VALUE } from '../../src/constants/queue';
import { ElementStates } from '../../src/types/element-states';
import { DELAY_IN_MS } from '../../src/constants/delays';
import { CIRCLES_COUNT } from '../../src/constants/queue';
import { CIRCLES } from "../../src/constants/cypress-selectors";


describe('queuePage functions properly', () => {

  const ITERATIONS = 3;
  const queue = new Queue(CIRCLES_COUNT);


  beforeEach(() => {
    cy.visit(`${testURL}${ROUTES.QUEUE}`);
  });

  it('should disable the button when input is empty', () => {
    cy.get('form#queue input[type="text"]').should('have.value', '');
    cy.get('form#queue button').should('be.disabled');
  });


  it('should elements to the queue correctly', () => {
    queue.reset();
    cy.get(CIRCLES).as('circles');

    // add several elements and check animation
    for (let i = 0; i <= ITERATIONS; i++) {
      const inputValue = Math.floor(Math.random() * MAX_INPUT_VALUE) + 1;

      cy.get('form#queue input[type="text"]').type(inputValue);
      cy.contains('button', 'Добавить').click();
      queue.enqueue(inputValue);

      cy.get('@circles').eq(i).invoke('attr', 'class').should('include', ElementStates.Changing);
      cy.get('@circles').eq(i).invoke('attr', 'class').should('include', ElementStates.Default);
      cy.get('@circles').eq(i).should('have.text', inputValue);
    }

    // check for rendering correctness
    const expectedRes = queue.getItems().map(item => (item !== null ? item : ''));
    expectedRes.forEach((item, index) => {
      if (item !== '') {
        cy.get('@circles').eq(index).should('have.text', item);
      }
    });

    // check head and tail
    const head = queue.getHead();
    const tail = queue.getTail();

    cy.get('@circles').eq(head).get('[class*="circle_head"]')
      .should('exist')
      .should('have.text', 'head');

    cy.get('@circles').eq(tail).get('[class*="circle_tail"]')
      .should('exist')
      .should('have.text', 'tail');
  });


  it('should add and then delete elements from the queue correctly', () => {
    queue.reset();
    cy.get(CIRCLES).as('circles');

    // add several elements
    addElementToQueue(queue, ITERATIONS);

    // delete an element and check animation
    cy.contains('button', 'Удалить').click();
    queue.dequeue();
    const head = queue.getHead();
    const tail = queue.getTail();

    cy.get('@circles').eq(head - 1).invoke('attr', 'class').should('include', ElementStates.Changing)
    cy.get('@circles').eq(head).invoke('attr', 'class').should('include', ElementStates.Default)

    // check for rendering correctness
    const expectedRes = queue.getItems().map(item => (item !== null ? item : ''));
    expectedRes.forEach((item, index) => {
      if (item !== '') {
        cy.get('@circles').eq(index).should('have.text', item);
      }
    });

    // // check head and tail
    cy.get('@circles').eq(head).get('[class*="circle_head"]')
      .should('exist')
      .should('have.text', 'head');

    cy.get('@circles').eq(tail).get('[class*="circle_tail"]')
      .should('exist')
      .should('have.text', 'tail');
  });


  it('should reset the queue correctly', () => {
    queue.reset();
    cy.get(CIRCLES).as('circles');

    // add several elements
    addElementToQueue(queue, ITERATIONS);

    // reset the queue
    cy.contains('button', 'Очистить').click();
    queue.reset();

    // check for rendering correctness
    const expectedRes = queue.getItems().map(item => (item !== null ? item : ''));
    const expectedResLength = queue.getLength();
    let length = 0;
    expectedRes.forEach((item, index) => {
      if (item !== '') {
        cy.get('@circles').eq(index).should('have.text', item);
        length++;
      }
      // use this way to count the length because cypress actually counts all rendered but empty circles
    });
    expect(length).to.equal(expectedResLength);
  });
});


// function to add new elements
function addElementToQueue(queue, iterations = 1) {
  for (let i = 0; i <= iterations; i++) {
    const inputValue = Math.floor(Math.random() * MAX_INPUT_VALUE) + 1;

    cy.get('form#queue input[type="text"]').type(inputValue);
    cy.contains('button', 'Добавить').click();
    queue.enqueue(inputValue);

    cy.wait(DELAY_IN_MS);
  }
}