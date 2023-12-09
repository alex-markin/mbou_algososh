import { Stack } from "../../src/components/stack-page/stack";
import { generateRandomString } from "../../src/utils/generate-random-string";
import { MAX_INPUT_LENGTH } from "../../src/constants/stack";
import { DELAY_IN_MS } from "../../src/constants/delays";
import { ElementStates } from "../../src/types/element-states"
import { ROUTES } from "../../src/constants/routes";

describe('stringPage functions properly', () => {

  const ELEMENTS_TO_ADD = 3; // Number of elements to add to stack in delete\reset tests

  beforeEach(() => {
    cy.visit(`http://localhost:3000/#${ROUTES.STACK}`);
  });

  it('should disable the button when input is empty', () => {
    cy.get('form#stack input[type="text"]').should('have.value', '');
    cy.get('form#stack button[type="submit').should('be.disabled');
  });

  it('should push string and animate properly', () => {
    const inputValue = generateRandomString(Math.floor(Math.random() * MAX_INPUT_LENGTH) + 1);
    const stack = new Stack(); // create new stack
    stack.push(inputValue);
    const expectedRes = stack.getItems();

    cy.get('form#stack input[type="text"]').type(inputValue);
    cy.get('form#stack button[type="submit').click();

    cy.get('[class*="stack-page_outputBlock"]').get('[class*="circle_circle"]').as('circles');

    expectedRes.forEach((item, index) => {
      // Check for value correctness
      cy.get('@circles').eq(index).should('have.text', item);

      // Check for correct circle color for Modified in the last added element
      cy.get('@circles').eq(expectedRes.length - 1)
        .invoke('attr', 'class')
        .should('include', ElementStates.Changing);

      // Check for correct circle color for Default
      cy.get('@circles').eq(index)
        .invoke('attr', 'class')
        .should('include', ElementStates.Default);
    });
  });

  it('should pop element and animate properly', () => {

    const stack = new Stack(); // create new stack

    addElements(stack, ELEMENTS_TO_ADD, DELAY_IN_MS);

    cy.get('[class*="stack-page_outputBlock"]').get('[class*="circle_circle"]').as('circles');
    cy.contains('button', 'Удалить').click();
    stack.pop();
    const expectedResAfterPop = stack.getItems();


    expectedResAfterPop.forEach((item, index) => {
      // Check for value correctness
      cy.get('@circles').eq(index).should('have.text', item);

      // Check for correct circle color for Changing 
      cy.get('@circles').eq(expectedResAfterPop.length - 1)
        . invoke('attr', 'class')
        .should('include', ElementStates.Changing);

      // Check for correct circle color for Default
      cy.get('@circles').eq(index)
        .invoke('attr', 'class')
        .should('include', ElementStates.Default);

      
    });
  });

  it('should clear stack properly', () => {
    const stack = new Stack(); // create new stack
    addElements(stack, ELEMENTS_TO_ADD, DELAY_IN_MS);

    cy.contains('button', 'Очистить').click();
    stack.reset();

    cy.get('[class*="stack-page_outputBlock"]').get('[class*="circle_circle"]').should('not.exist');

  });
});

// Helper function to add elements to stack
function addElements(stack, elementsToAdd, waitTime) {
  for (let i = 0; i < elementsToAdd; i++) {
    const inputValue = generateRandomString(Math.floor(Math.random() * MAX_INPUT_LENGTH) + 1);
    cy.get('form#stack input[type="text"]').type(inputValue);
    cy.get('form#stack button[type="submit').click();
    stack.push(inputValue);

    cy.wait(waitTime);
  }
}